/**
 * @file Tabs.test.tsx
 * @description Tests pour les écrans principaux de l'application (Home, Learn, Verify).
 */

import React from 'react';
import { render, waitFor, fireEvent } from '@testing-library/react-native';
import HomeScreen from '../(tabs)/index';
import LearnScreen from '../(tabs)/learn';
import VerifyScreen from '../(tabs)/verify';
import { factCheckAPI, imageVerificationAPI } from '../../services/api';
import { useRouter } from 'expo-router';

// Mocks
jest.mock('../../services/api', () => ({
  factCheckAPI: {
    getHistory: jest.fn(),
  },
  imageVerificationAPI: {
    getHistory: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

// Mock pour useVerify hook utilisé dans VerifyScreen
jest.mock('../../hooks/useVerify', () => ({
  useVerify: () => ({
    tab: 'Texte',
    setTab: jest.fn(),
    loading: false,
    texte: '',
    setTexte: jest.fn(),
    canAnalyze: () => true,
    handleAnalyze: jest.fn(),
    ctaLabel: () => 'Analyser',
  }),
}));

describe('Tab Screens', () => {
  const mockRouter = { push: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
    (factCheckAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
    (imageVerificationAPI.getHistory as jest.Mock).mockResolvedValue({ data: [] });
  });

  describe('HomeScreen', () => {
    it('charge et affiche l\'historique', async () => {
      const mockData = [{ id: '1', texte: 'Test info', statut: 'vérifié', date: new Date().toISOString() }];
      (factCheckAPI.getHistory as jest.Mock).mockResolvedValue({ data: mockData });

      const { getByText } = render(<HomeScreen />);

      await waitFor(() => {
        expect(factCheckAPI.getHistory).toHaveBeenCalled();
        expect(getByText('Récentes')).toBeTruthy();
      });
    });
  });

  describe('LearnScreen', () => {
    it('affiche le titre et les fiches', () => {
      const { getByText } = render(<LearnScreen />);
      expect(getByText(/Apprendre à/)).toBeTruthy();
      expect(getByText('Toutes les fiches')).toBeTruthy();
    });
  });

  describe('VerifyScreen', () => {
    it('affiche la barre de navigation et le titre', () => {
      const { getByText } = render(<VerifyScreen />);
      expect(getByText(/Que/)).toBeTruthy();
      expect(getByText('Analyser')).toBeTruthy();
    });
  });
});
