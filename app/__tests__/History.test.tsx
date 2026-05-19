/**
 * @file History.test.tsx
 * @description Tests pour l'écran "Faits vérifiés" (anciennement Historique).
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import History from '../history/index';
import { useRouter } from 'expo-router';
import { factCheckAPI, imageVerificationAPI } from '../../services/api';

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

jest.mock('../../services/api', () => ({
  factCheckAPI: {
    getHistory: jest.fn(),
  },
  imageVerificationAPI: {
    getHistory: jest.fn(),
  },
}));

describe('History Screen (verified-only)', () => {
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (factCheckAPI.getHistory as jest.Mock).mockResolvedValue({
      data: [
        {
          id: 1,
          texte: 'Référendum constitutionnel Mali juin 2026',
          statut: 'vérifié',
          date: '2026-03-12T10:27:00Z',
          source: '',
        },
        {
          id: 2,
          texte: 'Une information rejetée',
          statut: 'rejeté',
          date: '2026-03-11T09:00:00Z',
          source: '',
        },
        {
          id: 3,
          texte: 'Une information en cours',
          statut: 'en cours',
          date: '2026-03-10T08:00:00Z',
          source: '',
        },
      ],
    });
    (imageVerificationAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
  });

  it('rend le titre et le sous-titre alignés sur la Library', async () => {
    const { getByText, getByTestId } = render(<History />);

    await waitFor(() => {
      expect(getByText('FAITS VÉRIFIÉS')).toBeTruthy();
      expect(getByTestId('history-count')).toBeTruthy();
      expect(getByText(/faits vérifiés/)).toBeTruthy();
    });
  });

  it('n\'affiche que les soumissions vérifiées (filtre verdict VRAI)', async () => {
    const { getByText, queryByText } = render(<History />);

    await waitFor(() => {
      expect(getByText('Référendum constitutionnel Mali juin 2026')).toBeTruthy();
    });

    expect(queryByText('Une information rejetée')).toBeNull();
    expect(queryByText('Une information en cours')).toBeNull();
  });

  it('n\'affiche plus les puces de filtrage par verdict', async () => {
    const { queryByText } = render(<History />);

    await waitFor(() => {
      expect(queryByText(/Fausses :/)).toBeNull();
      expect(queryByText(/À nuancer :/)).toBeNull();
      expect(queryByText(/Tout :/)).toBeNull();
    });
  });

  it('navigue vers le résultat lors d\'un clic sur une ligne', async () => {
    const { getByText } = render(<History />);

    await waitFor(() => {
      expect(getByText('Référendum constitutionnel Mali juin 2026')).toBeTruthy();
    });

    fireEvent.press(getByText('Référendum constitutionnel Mali juin 2026'));

    expect(mockRouter.push).toHaveBeenCalledWith('/result/1?kind=text');
  });

  it('retourne en arrière lors du clic sur le bouton retour', () => {
    const { getByTestId } = render(<History />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockRouter.back).toHaveBeenCalled();
  });

  it('affiche un état vide quand aucun fait n\'est vérifié', async () => {
    (factCheckAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
    const { getByText } = render(<History />);

    await waitFor(() => {
      expect(getByText(/Aucun fait vérifié pour le moment/)).toBeTruthy();
    });
  });
});
