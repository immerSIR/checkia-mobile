/**
 * @file Result.test.tsx
 * @description Tests pour la page de détail d'un résultat (Rapport).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import ResultScreen from '../result/[id]';
import { useRouter } from 'expo-router';

// Mock expo-router
jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Result Screen', () => {
  const mockRouter = { back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  it('affiche les informations du rapport (N° et date)', () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText(/Rapport N°024/)).toBeTruthy();
    expect(getByText(/12 MAR 2026/)).toBeTruthy();
  });

  it('affiche l\'indice de confiance et le score', () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText('INDICE DE CONFIANCE')).toBeTruthy();
    expect(getByText('ÉLEVÉ')).toBeTruthy();
    expect(getByText('87%')).toBeTruthy();
  });

  it('affiche l\'affirmation vérifiée', () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText(/Le Mali va organiser un référendum/)).toBeTruthy();
  });

  it('liste les sources croisées', () => {
    const { getByTestId, getByText } = render(<ResultScreen />);

    expect(getByTestId('sources-title')).toBeTruthy();
    expect(getByText('benbere.com')).toBeTruthy();
    expect(getByText('AFP Fact Check')).toBeTruthy();
  });

  it('affiche le disclaimer de l\'IA', () => {
    const { getByText } = render(<ResultScreen />);

    expect(getByText(/Résultat généré par IA/)).toBeTruthy();
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
