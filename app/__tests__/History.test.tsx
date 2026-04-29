/**
 * @file History.test.tsx
 * @description Tests pour la page d'historique.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import History from '../history/index';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('History Screen', () => {
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('rend correctement les titres et le résumé', () => {
    const { getByText, getByTestId } = render(<History />);

    expect(getByText('HISTORIQUE')).toBeTruthy();
    expect(getByTestId('history-count')).toBeTruthy();
    expect(getByText(/Du 4 février au 12 mars 2026/)).toBeTruthy();
  });

  it('affiche les groupes de dates et les éléments', () => {
    const { getByText } = render(<History />);

    expect(getByText("AUJOURD'HUI · 12 MAR")).toBeTruthy();
    expect(getByText("Référendum constitutionnel Mali juin 2026")).toBeTruthy();
    expect(getByText("BENBERE.COM")).toBeTruthy();
  });

  it('affiche les puces de filtrage', () => {
    const { getByText } = render(<History />);

    expect(getByText('Tout : 24')).toBeTruthy();
    expect(getByText('Vraies : 18')).toBeTruthy();
    expect(getByText('Fausses : 6')).toBeTruthy();
  });

  it('navigue vers le résultat lors d\'un clic sur une ligne', () => {
    const { getByText } = render(<History />);

    fireEvent.press(getByText("Référendum constitutionnel Mali juin 2026"));

    expect(mockRouter.push).toHaveBeenCalledWith('/result/1');
  });

  it('retourne en arrière lors du clic sur le bouton retour', () => {
    const { getByTestId } = render(<History />);
    fireEvent.press(getByTestId('back-button'));
    expect(mockRouter.back).toHaveBeenCalled();
  });
});
