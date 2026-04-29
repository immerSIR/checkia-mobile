import React from 'react';
import { render, fireEvent } from '@testing-library/react-native';
import { Button } from '../Button';

describe('Button Component', () => {
  it('affiche correctement le label', () => {
    const { getByText } = render(
      <Button label="Tester" onPress={() => {}} />
    );
    expect(getByText('Tester')).toBeTruthy();
  });

  it('appelle onPress lors du clic', () => {
    const onPressMock = jest.fn();
    const { getByText } = render(
      <Button label="Cliquer" onPress={onPressMock} />
    );

    fireEvent.press(getByText('Cliquer'));
    expect(onPressMock).toHaveBeenCalledTimes(1);
  });

  it('affiche un indicateur de chargement quand loading est vrai', () => {
    const { queryByText, getByTestId } = render(
      <Button label="Chargement" onPress={() => {}} loading={true} />
    );

    // Le texte ne devrait pas être visible si on charge
    expect(queryByText('Chargement')).toBeNull();
  });
});
