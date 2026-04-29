// app/_layout.tsx
import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as SecureStore from 'expo-secure-store';
import { Colors } from '../constants/colors';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  const [token, setToken] = useState<string | null>(null);
  const [checked, setChecked] = useState(false);

  useEffect(() => {
    SecureStore.getItemAsync('token').then((t) => {
      setToken(t);
      setChecked(true);
    });
  }, []);

  if (!checked) return null;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="splash" />
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="loading" />
        <Stack.Screen name="result/[id]" />
        <Stack.Screen name="history/index" />
        <Stack.Screen name="learn/[slug]" />
      </Stack>
    </SafeAreaProvider>
  );
}