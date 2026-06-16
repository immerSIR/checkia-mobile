import axios from 'axios';
import { Session } from '@supabase/supabase-js';
import { supabase } from './supabase';

const TEST_BACKEND_URL = 'http://localhost:8000';

const normalizeBackendUrl = (value: string) => value.trim().replace(/\/+$/, '').replace(/\/api$/, '');

const getBackendUrl = () => {
  const configuredBackendUrl = process.env.EXPO_PUBLIC_BACKEND_URL?.trim()
    || process.env.EXPO_PUBLIC_API_URL?.trim();
  if (configuredBackendUrl) {
    return normalizeBackendUrl(configuredBackendUrl);
  }

  if (process.env.NODE_ENV === 'test') {
    return TEST_BACKEND_URL;
  }

  throw new Error('Missing EXPO_PUBLIC_BACKEND_URL. Set it in .env to the Check-IA backend base URL.');
};

export const BACKEND_URL = getBackendUrl();
export const API_URL = BACKEND_URL;

export const api = axios.create({ baseURL: BACKEND_URL });

type AuthRequiredListener = () => void;

const authRequiredListeners = new Set<AuthRequiredListener>();

export const onAuthRequired = (listener: AuthRequiredListener) => {
  authRequiredListeners.add(listener);
  return () => authRequiredListeners.delete(listener);
};

const notifyAuthRequired = () => {
  authRequiredListeners.forEach((listener) => listener());
};

api.interceptors.request.use(async (config) => {
  const { data } = await supabase.auth.getSession();
  const token = data.session?.access_token;
  if (token) {
    config.headers = config.headers ?? {};
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (__DEV__ && error.response) {
      const method = (originalRequest?.method || '').toUpperCase();
      const url = `${originalRequest?.baseURL ?? ''}${originalRequest?.url ?? ''}`;
      console.log(`[API ${error.response.status}] ${method} ${url}`);
    }

    if (error.response?.status !== 401 || originalRequest?._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;
    const { data, error: refreshError } = await supabase.auth.refreshSession();
    const token = data.session?.access_token;

    if (!refreshError && token) {
      originalRequest.headers = originalRequest.headers ?? {};
      originalRequest.headers.Authorization = `Bearer ${token}`;
      return api(originalRequest);
    }

    await supabase.auth.signOut();
    notifyAuthRequired();
    return Promise.reject(error);
  },
);

export type BackendStatus = 'en cours' | 'vérifié' | 'rejeté';

export type SubmissionCreated = {
  task_id: string;
};

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
  statut?: BackendStatus;
  status?: string;
  message?: string;
  error?: string;
  result?: any;
  id?: string | number;
  submission_id?: string | number;
  task_id?: string;
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
    api.post<SubmissionCreated>('/api/submissions/', data),
  getResult: (id: string | number) =>
    api.get<Submission[]>('/api/submissions/').then((response) => {
      const submission = response.data.find((item) => String(item.id) === String(id));
      if (!submission) {
        throw new Error('Résultat introuvable.');
      }
      return { ...response, data: submission };
    }),
  getHistory: () =>
    api.get<Submission[]>('/api/submissions/'),
};

export const imageVerificationAPI = {
  detectAI: (imageUri: string) =>
    api.post('/api/detect-ai-image/', imageFormData(imageUri), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  verifyContent: (imageUri: string, claimText = '') =>
    api.post('/api/verify-image-content/', imageFormData(imageUri, { claim: claimText }), {
      headers: { 'Content-Type': 'multipart/form-data' },
    }),
  getHistory: () =>
    api.get<ImageVerification[]>('/api/image-verifications/'),
};

export const taskAPI = {
  getStatus: (taskId: string) =>
    api.get<TaskStatusResponse>(`/api/task-status/${taskId}/`),
};

export type BambaraLang = 'bm' | 'fr';

const audioMimeFromUri = (uri: string) => {
  const ext = uri.split('.').pop()?.toLowerCase().split('?')[0];
  if (ext === 'wav') return 'audio/wav';
  if (ext === 'caf') return 'audio/x-caf';
  if (ext === 'aac') return 'audio/aac';
  return 'audio/m4a';
};

export const bambaraAPI = {
  transcribe: (audioUri: string) => {
    const name = getFilename(audioUri, 'dictation-bm.m4a');
    const form = new FormData();
    form.append('file', {
      uri: audioUri,
      name,
      type: audioMimeFromUri(name),
    } as any);
    form.append('language', 'bm');
    return api.post<{ text: string }>('/api/bambara/transcribe/', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 240_000,
    });
  },
  translate: (text: string, sourceLang: BambaraLang, targetLang: BambaraLang) =>
    api.post<{ translated_text: string }>('/api/bambara/translate/', {
      text,
      source_lang: sourceLang,
      target_lang: targetLang,
    }, { timeout: 30_000 }),
};

export const authAPI = {
  login: async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return { data };
  },
  register: async (data: {
    email: string;
    password: string;
    first_name?: string;
    last_name?: string;
    country?: string;
  }) => {
    const { data: result, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          first_name: data.first_name,
          last_name: data.last_name,
          country: data.country,
        },
      },
    });
    if (error) throw error;
    return { data: result };
  },
  getSession: async (): Promise<Session | null> => {
    const { data } = await supabase.auth.getSession();
    return data.session;
  },
  me: async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) throw error;
    return { data: data.user };
  },
  logout: async () => {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
  },
  resetPassword: async (email: string) => {
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) throw error;
  },
};

export const contentAPI = {
  getFacts: () => api.get('/api/facts/'),
  getKeywords: () => api.get('/api/keywords/'),
};

