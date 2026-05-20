/**
 * @file HomeComponents.test.tsx
 * @description Tests unitaires pour les composants du module Home (HistoryRow, HomeHeader, HomeHero).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { HistoryRow } from '../HistoryRow';
import { HomeHeader } from '../HomeHeader';
import { HomeHero } from '../HomeHero';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock expo-router
const mockPush = jest.fn();
jest.mock('expo-router', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

// Mock Helpers
jest.mock('../../../utils/homeHelpers', () => ({
  timeAgo: jest.fn(() => 'Il y a 2h'),
  getDayLabel: jest.fn(() => 'Lundi 1 Janvier'),
  getVerdictUI: jest.fn((v) => ({
    bg: '#FFF',
    color: '#000',
    label: v === 'VRAI' ? 'VRAI' : 'FAUX'
  })),
}));

describe('Home Module Components', () => {

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe('HistoryRow', () => {
    const mockItem = {
      verdict: 'VRAI',
      type: 'url',
      raw_input: 'https://test.com',
      created_at: '2023-01-01',
      score: 95
    };

    it('affiche le contenu de l\'historique et le score', () => {
      const { getByText } = render(<HistoryRow item={mockItem} isLast={false} onPress={() => {}} />);
      expect(getByText('https://test.com')).toBeTruthy();
      expect(getByText('95%')).toBeTruthy();
      expect(getByText('✓ VRAI')).toBeTruthy();
    });

    it('appelle onPress lors du clic sur la ligne', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<HistoryRow item={mockItem} isLast={false} onPress={onPressMock} />);
      fireEvent.press(getByText('https://test.com'));
      expect(onPressMock).toHaveBeenCalled();
    });
  });

  describe('HomeHeader', () => {
    it('affiche le nom de l\'utilisateur et la date', () => {
      const { getByText } = render(<HomeHeader name="ImmersIA" initials="IA" />);
      expect(getByText(/Bonjour/)).toBeTruthy();
      expect(getByText(/ImmersIA/)).toBeTruthy();
      expect(getByText('Lundi 1 Janvier')).toBeTruthy();
    });

    it('affiche les initiales transmises et navigue vers le profil', () => {
      const { getByText } = render(<HomeHeader name="ImmersIA" initials="IA" />);
      fireEvent.press(getByText('IA'));
      expect(mockPush).toHaveBeenCalledWith('/profile');
    });
  });

  describe('HomeHero', () => {
    it('affiche le titre de la section Hero', () => {
      const { getByText } = render(<HomeHero />);
      expect(getByText(/Analysez une/)).toBeTruthy();
    });

    it('navigue vers verify lors du clic sur le bouton', () => {
      const { getByText } = render(<HomeHero />);
      fireEvent.press(getByText('Lancer une vérification'));
      expect(mockPush).toHaveBeenCalledWith('/verify');
    });
  });

});
