/**
 * @file useVerify.test.ts
 * @description Tests unitaires pour le hook useVerify.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useVerify } from '../useVerify';
import * as DocumentPicker from 'expo-document-picker';
import * as ImagePicker from 'expo-image-picker';
import { urlPreviewAPI } from '../../services/api';

// Mocks
jest.mock('expo-document-picker');
jest.mock('expo-image-picker');
jest.mock('../../services/api', () => ({
  urlPreviewAPI: {
    fetch: jest.fn(),
  },
}));

// Mock timer
jest.useFakeTimers();

describe('useVerify Hook', () => {
  const mockRouter = { push: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('initialise avec les valeurs par défaut', () => {
    const { result } = renderHook(() => useVerify(mockRouter));
    expect(result.current.tab).toBe('Texte');
  });

  describe('Validation URL et Preview', () => {
    it('déclenche le chargement de l\'aperçu après un délai', async () => {
      (urlPreviewAPI.fetch as jest.Mock).mockResolvedValue({ data: { title: 'Test' } });
      const { result } = renderHook(() => useVerify(mockRouter));

      await act(async () => {
        result.current.handleUrlChange('https://test.com');
      });

      // Avancer le timer de l'anti-rebond (debounce)
      await act(async () => {
        jest.advanceTimersByTime(800);
      });

      expect(urlPreviewAPI.fetch).toHaveBeenCalledWith('https://test.com');
    });
  });

  describe('Analyse et Redirection', () => {
    it('gère le cycle complet de l\'analyse', async () => {
      const { result } = renderHook(() => useVerify(mockRouter));

      act(() => {
        result.current.setTexte('Info importante');
      });

      await act(async () => {
        result.current.handleAnalyze();
      });

      expect(result.current.loading).toBe(true);

      // Simuler la fin de l'intervalle d'analyse
      await act(async () => {
        jest.runAllTimers();
      });

      expect(result.current.loading).toBe(false);
      expect(mockRouter.push).toHaveBeenCalledWith('/result/1');
    });
  });

  describe('canAnalyze', () => {
    it('vérifie la validité des entrées pour chaque onglet', () => {
      const { result } = renderHook(() => useVerify(mockRouter));

      // Texte
      act(() => { result.current.setTab('Texte'); });
      expect(result.current.canAnalyze()).toBe(false);
      act(() => { result.current.setTexte('Test'); });
      expect(result.current.canAnalyze()).toBe(true);

      // URL
      act(() => { result.current.setTab('URL'); });
      act(() => { result.current.handleUrlChange(''); });
      expect(result.current.canAnalyze()).toBe(false);
      act(() => { result.current.handleUrlChange('http://test.com'); });
      expect(result.current.canAnalyze()).toBe(true);
    });
  });
});
