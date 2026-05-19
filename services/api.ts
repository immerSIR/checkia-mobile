import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

const DEFAULT_API_URL = 'http://localhost:8000/api';
const configuredApiUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

export const API_URL = configuredApiUrl || DEFAULT_API_URL;

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export const factCheckAPI = {
  submit: (data: { input_type: string; raw_input: string }) =>
    api.post('/fact-check/', data),
  getResult: (id: string) =>
    api.get(`/fact-check/${id}/`),
  getHistory: () =>
    api.get('/fact-check/history/'),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/token/', {email, password }),
  register: (data: object) =>
    api.post('/auth/register/', data),
};

export const urlPreviewAPI = {
  fetch: (url: string) =>
    api.get('/fact-check/preview/', { params: { url } }),
};
