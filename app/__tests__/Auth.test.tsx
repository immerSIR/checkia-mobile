/**
 * @file Auth.test.tsx
 * @description Tests complets pour le module d'authentification.
 */

import React from 'react';
import { render, fireEvent, waitFor } from '@testing-library/react-native';
import Onboarding from '../(auth)/onboarding';
import Login from '../(auth)/login';
import Register from '../(auth)/register';
import ForgotPassword from '../(auth)/forgot-password';
import { authAPI } from '../../services/api';
import { useRouter } from 'expo-router';

// Mocks
jest.mock('../../services/api', () => ({
  authAPI: {
    login: jest.fn(),
    register: jest.fn(),
    getSession: jest.fn(),
    resetPassword: jest.fn(),
  },
}));

jest.mock('expo-router', () => ({
  useRouter: jest.fn(),
}));

describe('Auth Module', () => {
  const mockRouter = { push: jest.fn(), replace: jest.fn(), back: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    (useRouter as jest.Mock).mockReturnValue(mockRouter);
  });

  describe('Onboarding', () => {
    it('rend correctement et permet de naviguer', () => {
      const { getByText } = render(<Onboarding />);
      expect(getByText('Commencer')).toBeTruthy();

      fireEvent.press(getByText('Commencer'));
      expect(mockRouter.push).toHaveBeenCalledWith('/(auth)/register');
    });
  });

  describe('Login', () => {
    it('gère une connexion réussie', async () => {
      (authAPI.login as jest.Mock).mockResolvedValue({
        data: { session: { access_token: 'tk' } }
      });
      const { getByPlaceholderText, getByText } = render(<Login />);

      fireEvent.changeText(getByPlaceholderText('vous@exemple.com'), 'a@b.com');
      fireEvent.changeText(getByPlaceholderText('••••••••'), 'pass');
      fireEvent.press(getByText('Se connecter'));

      await waitFor(() => {
        expect(authAPI.login).toHaveBeenCalled();
        expect(mockRouter.replace).toHaveBeenCalledWith('/(tabs)');
      });
    });
  });

  describe('Register', () => {
    it('valide les champs et accepte les CGU', async () => {
      (authAPI.register as jest.Mock).mockResolvedValue({ data: { user: { id: 'u1' } } });
      (authAPI.getSession as jest.Mock).mockResolvedValue({ access_token: 'tk' });
      const { getByText, getByPlaceholderText } = render(<Register />);

      fireEvent.changeText(getByPlaceholderText('Ibrahima'), 'Jean');
      fireEvent.changeText(getByPlaceholderText('Koné'), 'Test');
      fireEvent.changeText(getByPlaceholderText('nom@exemple.com'), 'j@t.com');
      fireEvent.changeText(getByPlaceholderText('••••••'), 'password123');

      // Cocher CGU
      fireEvent.press(getByText(/J'accepte les/));

      fireEvent.press(getByText('Créer mon compte'));

      await waitFor(() => {
        expect(authAPI.register).toHaveBeenCalled();
      });
    });
  });

  describe('ForgotPassword', () => {
    it('permet d\'envoyer un lien de récupération', async () => {
      const { getByPlaceholderText, getByText, getByTestId } = render(<ForgotPassword />);

      fireEvent.changeText(getByPlaceholderText('vous@exemple.com'), 'test@test.com');
      fireEvent.press(getByText('Envoyer le lien'));

      await waitFor(() => {
        expect(authAPI.resetPassword).toHaveBeenCalledWith('test@test.com');
        expect(getByTestId('sent-title')).toBeTruthy();
      });
    });
  });
});
