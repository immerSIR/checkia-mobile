import axios from 'axios';
import * as SecureStore from 'expo-secure-store';

export const ACCESS_TOKEN_KEY = 'token';
export const REFRESH_TOKEN_KEY = 'refresh_token';

const DEFAULT_API_URL = 'http://localhost:8000/api';

const normalizeApiUrl = (value?: string) => {
  const trimmed = value?.trim();
  if (!trimmed) return DEFAULT_API_URL;
  return trimmed.replace(/\/+$/, '');
};

export const API_URL = normalizeApiUrl(process.env.EXPO_PUBLIC_API_URL);

export const api = axios.create({ baseURL: API_URL });

api.interceptors.request.use(async (config) => {
  const token = await SecureStore.getItemAsync(ACCESS_TOKEN_KEY);
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export type BackendStatus = 'en cours' | 'vérifié' | 'rejeté';

export type Submission = {
  id: number | string;
  texte: string;
  source?: string | null;
  date: string;
  statut: BackendStatus;
  web_sources?: Array<any> | null;
  detailed_result?: string | null;
  task_id?: string;
};

export type ImageVerification = {
  id: number | string;
  verification_type: 'content' | 'ai_detection';
  claim_text?: string | null;
  status: string;
  explanation?: string;
  confidence?: number;
  date: string;
  image_url?: string;
  original_filename?: string;
};

export type TaskStatusResponse = {
  state: 'PENDING' | 'SUCCESS' | 'FAILURE' | string;
  status?: string;
  message?: string;
  error?: string;
  result?: any;
};

const getFilename = (uri: string, fallback: string) => {
  const fromUri = uri.split('/').pop()?.split('?')[0];
  return fromUri || fallback;
};

const getImageMimeType = (filename: string) => {
  const ext = filename.split('.').pop()?.toLowerCase();
  if (ext === 'png') return 'image/png';
  if (ext === 'webp') return 'image/webp';
  if (ext === 'heic') return 'image/heic';
  return 'image/jpeg';
};

const imageFormData = (imageUri: string, extra?: Record<string, string>) => {
  const name = getFilename(imageUri, 'image.jpg');
  const form = new FormData();
  form.append('image', {
    uri: imageUri,
    name,
    type: getImageMimeType(name),
  } as any);

  Object.entries(extra ?? {}).forEach(([key, value]) => {
    form.append(key, value);
  });

  return form;
};

export const factCheckAPI = {
  submit: (data: { texte: string; source?: string }) =>
    api.post<Submission>('/submissions/', data),
  getResult: (id: string | number) =>
    api.get<Submission>(`/submissions/${id}/`),
  getHistory: () =>
    api.get<Submission[]>('/submissions/'),
};

export const imageVerificationAPI = {
  detectAI: (imageUri: string) =>
    api.post('/detect-ai-image/', imageFormData(imageUri), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verifyContent: (imageUri: string, claimText = '') =>
    api.post('/verify-image-content/', imageFormData(imageUri, { claim_text: claimText }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: () =>
    api.get<ImageVerification[]>('/image-verifications/'),
};

export const taskAPI = {
  getStatus: (taskId: string) =>
    api.get<TaskStatusResponse>(`/task-status/${taskId}/`),
};

export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login/', { email, password }),
  register: (data: object) =>
    api.post('/auth/register/', data),
  me: () =>
    api.get('/auth/user/'),
  logout: () =>
    api.post('/auth/logout/'),
};

export const urlPreviewAPI = {
  fetch: async (url: string) => ({
    data: {
      source: new URL(url).hostname,
      title: url,
      desc: '',
    },
  }),
};
