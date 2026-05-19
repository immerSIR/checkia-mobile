/**
 * @file useVerify.test.ts
 * @description Tests unitaires pour le hook useVerify.
 */

import { renderHook, act } from '@testing-library/react-native';
import { useVerify } from '../useVerify';
import { factCheckAPI, taskAPI } from '../../services/api';

// Mocks
jest.mock('expo-document-picker');
jest.mock('expo-image-picker');
jest.mock('../../services/api', () => ({
  factCheckAPI: {
    submit: jest.fn(),
    getResult: jest.fn(),
    getHistory: jest.fn(),
  },
  imageVerificationAPI: {
    detectAI: jest.fn(),
    verifyContent: jest.fn(),
  },
  taskAPI: {
    getStatus: jest.fn(),
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
    expect(result.current.source).toBe('');
  });

  describe('Analyse et Redirection', () => {
    it('gère le cycle complet de l\'analyse texte avec source optionnelle', async () => {
      (factCheckAPI.submit as jest.Mock).mockResolvedValue({
        data: { task_id: 'task-1' },
      });
      (taskAPI.getStatus as jest.Mock).mockResolvedValue({
        data: { statut: 'vérifié', submission_id: 1 },
      });
      const { result } = renderHook(() => useVerify(mockRouter));

      act(() => {
        result.current.setTexte('Info importante');
        result.current.setSource('https://source.example/article');
      });

      await act(async () => {
        await result.current.handleAnalyze();
      });

      expect(result.current.loading).toBe(false);
      expect(factCheckAPI.submit).toHaveBeenCalledWith({
        texte: 'Info importante',
        source: 'https://source.example/article',
      });
      expect(mockRouter.push).toHaveBeenCalledWith('/result/1?kind=text');
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

      // Image needs both an URI and a mode
      act(() => { result.current.setTab('Image'); });
      expect(result.current.canAnalyze()).toBe(false);

      // Audio is intentionally disabled (coming soon)
      act(() => { result.current.setTab('Audio'); });
      expect(result.current.canAnalyze()).toBe(false);
    });
  });
});
