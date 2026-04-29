/**
 * @file LearnComponents.test.tsx
 * @description Tests unitaires pour les composants du module Learn (ArticleRow, CategoryCard, LearnChips, LearnHeader, LearnFeatured).
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { ArticleRow } from '../ArticleRow';
import { CategoryCard } from '../CategoryCard';
import { LearnChips } from '../LearnChips';
import { LearnHeader } from '../LearnHeader';
import { LearnFeatured } from '../LearnFeatured';

// Mock Ionicons
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

// Mock Data
jest.mock('../../../data/learnData', () => ({
  CHIPS: ['Tout', 'Santé', 'Politique', 'Techno'],
}));

describe('Learn Module Components', () => {

  describe('ArticleRow', () => {
    const mockArticle = {
      num: '01',
      cat: 'SANTÉ',
      dur: '5 min',
      title: 'Comment repérer une fake news ?'
    };

    it('affiche correctement les informations de l\'article', () => {
      const { getByText } = render(<ArticleRow a={mockArticle} isLast={false} onPress={() => {}} />);
      expect(getByText('01')).toBeTruthy();
      expect(getByText(/SANTÉ/)).toBeTruthy();
      expect(getByText('Comment repérer une fake news ?')).toBeTruthy();
    });

    it('appelle onPress lors du clic', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<ArticleRow a={mockArticle} isLast={false} onPress={onPressMock} />);
      fireEvent.press(getByText('Comment repérer une fake news ?'));
      expect(onPressMock).toHaveBeenCalled();
    });
  });

  describe('CategoryCard', () => {
    it('affiche le label et le nombre de fiches', () => {
      const { getByText } = render(<CategoryCard icon="book" lb="Éducation" count={12} />);
      expect(getByText('Éducation')).toBeTruthy();
      expect(getByText('12 fiches')).toBeTruthy();
    });
  });

  describe('LearnChips', () => {
    it('affiche tous les jetons (chips) définis dans les données', () => {
      const { getByText } = render(<LearnChips activeIndex={0} />);
      expect(getByText('Tout')).toBeTruthy();
      expect(getByText('Santé')).toBeTruthy();
      expect(getByText('Techno')).toBeTruthy();
    });
  });

  describe('LearnHeader', () => {
    it('affiche le titre de la section pédagogique', () => {
      const { getByText } = render(<LearnHeader />);
      expect(getByText('— FICHES PÉDAGOGIQUES')).toBeTruthy();
    });
  });

  describe('LearnFeatured', () => {
    it('affiche l\'article à la une avec son auteur', () => {
      const { getByText } = render(<LearnFeatured onPress={() => {}} />);
      expect(getByText(/À LA UNE/)).toBeTruthy();
      expect(getByText(/Aïssatou Diallo/)).toBeTruthy();
    });

    it('appelle onPress lors du clic sur l\'article à la une', () => {
      const onPressMock = jest.fn();
      const { getByText } = render(<LearnFeatured onPress={onPressMock} />);
      fireEvent.press(getByText(/À LA UNE/));
      expect(onPressMock).toHaveBeenCalled();
    });
  });
});
