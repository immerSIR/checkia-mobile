/**
 * @file Result.test.tsx
 * @description Tests pour la page de détail d'un résultat (Rapport).
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import ResultScreen from '../result/[id]';
import { useRouter } from 'expo-router';
import { factCheckAPI, imageVerificationAPI } from '../../services/api';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
  useLocalSearchParams: jest.fn(() => ({ id: '1', kind: 'text' })),
}));

jest.mock('../../services/api', () => ({
  factCheckAPI: {
    getResult: jest.fn(),
  },
  imageVerificationAPI: {
    getHistory: jest.fn(),
  },
}));

describe('Result Screen', () => {
  const mockRouter = { back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (factCheckAPI.getResult as jest.Mock).mockResolvedValue({
      data: {
        id: 1,
        texte: 'Le Mali va organiser un référendum constitutionnel en juin 2026.',
        statut: 'vérifié',
        date: '2026-03-12T10:00:00Z',
        detailed_result: 'Cette information est confirmée par plusieurs sources.',
        web_sources: [
          {
            url: 'https://benbere.com/article',
            snippet: 'Le décret fixe la date du référendum.',
          },
        ],
      },
    });
    (imageVerificationAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
  });

  it('affiche les informations du rapport', async () => {
    const { getByText } = render(<ResultScreen />);

    await waitFor(() => {
      expect(getByText(/Rapport N°001/)).toBeTruthy();
      expect(getByText(/12 MARS 2026/)).toBeTruthy();
    });
  });

  it('affiche l\'indice de confiance et le score', async () => {
    const { getByText } = render(<ResultScreen />);

    await waitFor(() => {
      expect(getByText('INDICE DE CONFIANCE')).toBeTruthy();
      expect(getByText('ÉLEVÉ')).toBeTruthy();
      expect(getByText('87%')).toBeTruthy();
    });
  });

  it('affiche l\'affirmation vérifiée', async () => {
    const { getByText } = render(<ResultScreen />);

    await waitFor(() => {
      expect(getByText(/Le Mali va organiser un référendum/)).toBeTruthy();
    });
  });

  it('liste les sources croisées', async () => {
    const { getByTestId, getByText } = render(<ResultScreen />);

    await waitFor(() => {
      expect(getByTestId('sources-title')).toBeTruthy();
      expect(getByText('benbere.com')).toBeTruthy();
    });
  });

  it('affiche le disclaimer de l\'IA', async () => {
    const { getByText } = render(<ResultScreen />);

    await waitFor(() => {
      expect(getByText(/Résultat généré par IA/)).toBeTruthy();
    });
  });

  it('permet de revenir en arrière', () => {
    const { getByTestId } = render(<ResultScreen />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('affiche les boutons d\'action en bas', () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText('Partager')).toBeTruthy();
    expect(getByText('Sauvegarder')).toBeTruthy();
  });
});
