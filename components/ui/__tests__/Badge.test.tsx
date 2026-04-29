import React from 'react';
import { render } from '@testing-library/react-native';
import { Badge } from '../Badge';

describe('Badge Component', () => {
  it('affiche le bon texte pour le verdict VRAI', () => {
    const { getByText } = render(<Badge verdict="VRAI" />);
    expect(getByText(/INFORMATION VRAIE/i)).toBeTruthy();
  });

  it('affiche le bon texte pour le verdict FAUX', () => {
    const { getByText } = render(<Badge verdict="FAUX" />);
    expect(getByText(/INFORMATION FAUSSE/i)).toBeTruthy();
  });

  it('affiche le bon texte pour le verdict DOUTEUX', () => {
    const { getByText } = render(<Badge verdict="DOUTEUX" />);
    expect(getByText(/INFORMATION DOUTEUSE/i)).toBeTruthy();
  });

  it('affiche le bon texte pour le verdict INCONNU', () => {
    const { getByText } = render(<Badge verdict="INCONNU" />);
    expect(getByText(/NON DÉTERMINÉ/i)).toBeTruthy();
  });
});
