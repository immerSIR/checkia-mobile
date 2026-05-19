import { useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '../constants/colors';
import { authAPI } from '../services/api';

export default function Splash() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      authAPI.getSession().then((session) => {
        router.replace(session ? '/(tabs)' : '/(auth)/onboarding');
      });
    }, 2500);
    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.glow} />
      <Text style={styles.icon}>✓</Text>
      <Text style={styles.title}>Check-IA</Text>
      <Text style={styles.sub}>Vérification par l'IA</Text>
      <Text style={styles.region}>Sahel Francophone</Text>
      <View style={styles.barTrack}>
        <View style={styles.barFill} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center' },
  glow: { width: 160, height: 160, borderRadius: 80, backgroundColor: Colors.accentDim, borderWidth: 2, borderColor: Colors.accent, position: 'absolute' },
  icon: { fontSize: 48, color: Colors.accent, fontWeight: '800', marginBottom: 20 },
  title: { fontSize: 32, fontWeight: '800', color: Colors.white, marginBottom: 8 },
  sub: { fontSize: 15, color: Colors.gray, marginBottom: 6 },
  region: { fontSize: 12, color: Colors.accent, marginBottom: 40 },
  barTrack: { width: 120, height: 4, backgroundColor: Colors.border, borderRadius: 2 },
  barFill: { width: '60%', height: 4, backgroundColor: Colors.accent, borderRadius: 2 },
});
