import React from 'react';
import { render } from '@testing-library/react-native';
import { MenuRow } from '../MenuRow';

// Mock Ionicons pour éviter les erreurs de rendu dans les tests
jest.mock('@expo/vector-icons', () => ({
  Ionicons: 'Ionicons',
}));

describe('MenuRow Component', () => {
  const mockItem = {
    icon: 'person-outline',
    label: 'Mon Profil',
    value: 'Modifier',
  };

  it('affiche correctement le label et la valeur', () => {
    const { getByText } = render(<MenuRow item={mockItem} isLast={false} />);

    expect(getByText('Mon Profil')).toBeTruthy();
    expect(getByText('Modifier')).toBeTruthy();
  });

  it('ne doit pas afficher de valeur si elle n\'est pas fournie dans l\'item', () => {
    const itemWithoutValue = {
      icon: 'settings-outline',
      label: 'Paramètres',
    };

    const { queryByText } = render(<MenuRow item={itemWithoutValue} isLast={true} />);

    expect(queryByText('Modifier')).toBeNull();
  });

  it('s\'affiche sans erreur sans la prop value', () => {
    const itemWithoutValue = {
      icon: 'settings-outline',
      label: 'Paramètres',
    };
    const { getByText } = render(<MenuRow item={itemWithoutValue} isLast={true} />);
    expect(getByText('Paramètres')).toBeTruthy();
  });
});
