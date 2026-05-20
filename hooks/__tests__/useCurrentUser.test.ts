/**
 * @file useCurrentUser.test.ts
 * @description Tests pour le hook useCurrentUser.
 */

import { renderHook, waitFor } from '@testing-library/react-native';
import { useCurrentUser } from '../useCurrentUser';
import { authAPI } from '../../services/api';

jest.mock('../../services/api', () => ({
  authAPI: {
    me: jest.fn(),
  },
}));

describe('useCurrentUser', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('extrait prénom, nom, pays et initiales depuis user_metadata', async () => {
    (authAPI.me as jest.Mock).mockResolvedValue({
      data: {
        email: 'ibrahima@example.com',
        user_metadata: { first_name: 'Ibrahima', last_name: 'Koné', country: 'Mali' },
      },
    });

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user.firstName).toBe('Ibrahima');
    expect(result.current.user.lastName).toBe('Koné');
    expect(result.current.user.fullName).toBe('Ibrahima Koné');
    expect(result.current.user.initials).toBe('IK');
    expect(result.current.user.country).toBe('Mali');
    expect(result.current.user.email).toBe('ibrahima@example.com');
  });

  it("retombe sur l'email quand user_metadata est vide", async () => {
    (authAPI.me as jest.Mock).mockResolvedValue({
      data: {
        email: 'jane@example.com',
        user_metadata: {},
      },
    });

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user.fullName).toBe('jane');
    expect(result.current.user.initials).toBe('J');
    expect(result.current.user.country).toBe('');
  });

  it('garde les valeurs de repli quand authAPI.me échoue', async () => {
    (authAPI.me as jest.Mock).mockRejectedValue(new Error('not authenticated'));

    const { result } = renderHook(() => useCurrentUser());

    await waitFor(() => {
      expect(result.current.loading).toBe(false);
    });

    expect(result.current.user.fullName).toBe('');
    expect(result.current.user.initials).toBe('?');
  });
});
