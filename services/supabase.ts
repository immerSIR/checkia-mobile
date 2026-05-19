import 'react-native-url-polyfill/auto';
import { AppState, Platform } from 'react-native';
import * as SecureStore from 'expo-secure-store';
import { createClient, processLock } from '@supabase/supabase-js';

const SECURE_STORE_CHUNK_SIZE = 1800;

const getEnv = (expoName: string, fallbackName: string, testValue = '') => {
  const value = process.env[expoName]?.trim() || process.env[fallbackName]?.trim();
  if (value) return value;
  if (process.env.NODE_ENV === 'test') return testValue;
  throw new Error(`Missing ${expoName}. Set it in .env before starting the app.`);
};

const chunkKey = (key: string, index: number) => `${key}.${index}`;
const metadataKey = (key: string) => `${key}.chunks`;

export const secureSupabaseStorage = {
  getItem: async (key: string) => {
    const chunkCountValue = await SecureStore.getItemAsync(metadataKey(key));
    const chunkCount = Number(chunkCountValue);

    if (!chunkCount || Number.isNaN(chunkCount)) {
      return SecureStore.getItemAsync(key);
    }

    const chunks = await Promise.all(
      Array.from({ length: chunkCount }, (_, index) => SecureStore.getItemAsync(chunkKey(key, index))),
    );

    if (chunks.some((chunk) => chunk == null)) {
      return null;
    }

    return chunks.join('');
  },

  setItem: async (key: string, value: string) => {
    await secureSupabaseStorage.removeItem(key);

    if (value.length <= SECURE_STORE_CHUNK_SIZE) {
      await SecureStore.setItemAsync(key, value);
      return;
    }

    const chunks = value.match(new RegExp(`.{1,${SECURE_STORE_CHUNK_SIZE}}`, 'g')) ?? [];
    await Promise.all(
      chunks.map((chunk, index) => SecureStore.setItemAsync(chunkKey(key, index), chunk)),
    );
    await SecureStore.setItemAsync(metadataKey(key), String(chunks.length));
  },

  removeItem: async (key: string) => {
    const chunkCountValue = await SecureStore.getItemAsync(metadataKey(key));
    const chunkCount = Number(chunkCountValue);

    if (chunkCount && !Number.isNaN(chunkCount)) {
      await Promise.all(
        Array.from({ length: chunkCount }, (_, index) => SecureStore.deleteItemAsync(chunkKey(key, index))),
      );
      await SecureStore.deleteItemAsync(metadataKey(key));
    }

    await SecureStore.deleteItemAsync(key);
  },
};

export const SUPABASE_URL = getEnv(
  'EXPO_PUBLIC_SUPABASE_URL',
  'SUPABASE_URL',
  'http://localhost:54321',
);

export const SUPABASE_ANON_KEY = getEnv(
  'EXPO_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_ANON_KEY',
  'test-anon-key',
);

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
  auth: {
    ...(Platform.OS !== 'web' ? { storage: secureSupabaseStorage } : {}),
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
    lock: processLock,
  },
});

if (Platform.OS !== 'web') {
  AppState.addEventListener('change', (state) => {
    if (state === 'active') {
      supabase.auth.startAutoRefresh();
    } else {
      supabase.auth.stopAutoRefresh();
    }
  });
}
