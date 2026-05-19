/**
 * @file History.test.tsx
 * @description Tests pour la page d'historique.
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

describe('History Screen', () => {
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
      ],
    });
    (imageVerificationAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
  });

  it('rend correctement les titres et le résumé', async () => {
    const { getByText, getByTestId } = render(<History />);

    await waitFor(() => {
      expect(getByText('HISTORIQUE')).toBeTruthy();
      expect(getByTestId('history-count')).toBeTruthy();
      expect(getByText(/vérifications/)).toBeTruthy();
    });
  });

  it('affiche les éléments backend', async () => {
    const { getByText } = render(<History />);

    await waitFor(() => {
      expect(getByText('VÉRIFICATIONS RÉCENTES')).toBeTruthy();
      expect(getByText('Référendum constitutionnel Mali juin 2026')).toBeTruthy();
      expect(getByText('TEXTE')).toBeTruthy();
    });
  });

  it('affiche les puces de filtrage', async () => {
    const { getByText } = render(<History />);

    await waitFor(() => {
      expect(getByText('Tout : 1')).toBeTruthy();
      expect(getByText('Vraies : 1')).toBeTruthy();
      expect(getByText('Fausses : 0')).toBeTruthy();
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
});
