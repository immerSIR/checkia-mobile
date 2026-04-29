/**
 * @file Input.test.tsx
 * @description Tests unitaires pour le composant Input.
 * Ces tests vérifient le rendu correct des labels, la gestion des événements de saisie,
 * l'affichage des messages d'erreur et l'interaction avec les icônes.
 */

import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Input } from '../Input';
import { Text } from 'react-native';

describe('Input Component', () => {
  /**
   * Vérifie que le composant affiche correctement le label passé en propriété.
   */
  it('affiche le label si fourni', () => {
    const { getByText } = render(<Input label="Nom d'utilisateur" />);
    expect(getByText("Nom d'utilisateur")).toBeTruthy();
  });

  /**
   * Vérifie que le callback onChangeText est appelé correctement lors d'une saisie utilisateur.
   */
  it('met à jour la valeur lors de la saisie', () => {
    const onChangeTextMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Entrez du texte" onChangeText={onChangeTextMock} />
    );

    const input = getByPlaceholderText('Entrez du texte');
    fireEvent.changeText(input, 'Bonjour');

    expect(onChangeTextMock).toHaveBeenCalledWith('Bonjour');
  });

  /**
   * Vérifie que le message d'erreur est affiché sous l'input lorsque la prop error est présente.
   */
  it('affiche l\'erreur si fournie', () => {
    const { getByText } = render(<Input error="Champ requis" />);
    expect(getByText('Champ requis')).toBeTruthy();
  });

  /**
   * Vérifie que l'action associée à l'icône de droite est déclenchée lors d'un clic.
   */
  it('appelle onRightIconPress quand l\'icône de droite est cliquée', () => {
    const onPressMock = jest.fn();
    const { getByTestId } = render(
      <Input
        rightIcon={<Text testID="right-icon">Icon</Text>}
        onRightIconPress={onPressMock}
      />
    );

    fireEvent.press(getByTestId('right-icon'));
    expect(onPressMock).toHaveBeenCalled();
  });

  /**
   * Vérifie que les événements onFocus et onBlur sont bien déclenchés.
   */
  it('déclenche onFocus et onBlur correctement', () => {
    const onFocusMock = jest.fn();
    const onBlurMock = jest.fn();
    const { getByPlaceholderText } = render(
      <Input placeholder="Focus test" onFocus={onFocusMock} onBlur={onBlurMock} />
    );

    const input = getByPlaceholderText('Focus test');

    fireEvent(input, 'focus');
    expect(onFocusMock).toHaveBeenCalled();

    fireEvent(input, 'blur');
    expect(onBlurMock).toHaveBeenCalled();
  });

  /**
   * Vérifie que l'icône de droite s'affiche correctement même sans action (onRightIconPress).
   */
  it('affiche l\'icône de droite comme un simple View si onRightIconPress n\'est pas fourni', () => {
    const { getByTestId } = render(
      <Input rightIcon={<Text testID="static-icon">Icon</Text>} />
    );
    expect(getByTestId('static-icon')).toBeTruthy();
  });
});
