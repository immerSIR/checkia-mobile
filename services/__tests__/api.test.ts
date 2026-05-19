import * as SecureStore from 'expo-secure-store';
import axios from 'axios';

// Mock complet d'axios AVANT l'import de l'api locale
jest.mock('axios', () => {
  const mAxiosInstance = {
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
    post: jest.fn(),
    get: jest.fn(),
    defaults: { headers: { common: {} } },
  };
  return {
    create: jest.fn(() => mAxiosInstance),
    interceptors: {
      request: { use: jest.fn(), eject: jest.fn() },
      response: { use: jest.fn(), eject: jest.fn() },
    },
  };
});

jest.mock('expo-secure-store', () => ({
  getItemAsync: jest.fn(),
}));

// On importe les APIs après le mock d'axios
import { api, factCheckAPI } from '../api';

describe('API Services', () => {
  const mockApi = api as any;

  // Pas de clearAllMocks ici car l'intercepteur est enregistré à l'import du module

  it('doit configurer l\'intercepteur de requête', () => {
    // Dans le code source, api.interceptors.request.use est appelé à l'initialisation
    expect(mockApi.interceptors.request.use).toHaveBeenCalled();
  });

  it('doit ajouter le token Authorization s\'il existe', async () => {
    const mockConfig = { headers: {} as any };
    (SecureStore.getItemAsync as jest.Mock).mockResolvedValue('fake-token');

    // Récupérer le callback passé à l'intercepteur
    // On cherche le dernier appel au cas où il y en aurait plusieurs,
    // ou on se fie au fait que c'est le premier (si on n'a pas clear)
    const interceptorCallback = mockApi.interceptors.request.use.mock.calls[0][0];
    const resultConfig = await interceptorCallback(mockConfig);

    expect(resultConfig.headers.Authorization).toBe('Bearer fake-token');
  });

  it('factCheckAPI.getHistory appelle le bon endpoint', async () => {
    // Pour ce test, on peut cleaner si on veut être sûr
    mockApi.get.mockClear();
    mockApi.get.mockResolvedValue({ data: [] });
    await factCheckAPI.getHistory();
    expect(mockApi.get).toHaveBeenCalledWith('/submissions/');
  });
});
