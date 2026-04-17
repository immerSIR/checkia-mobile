import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';

const { width } = Dimensions.get('window');

const SLIDES = [
  { icon: '🔍', title: 'Vérifiez en un instant', sub: 'Texte · URL · Image · Son' },
  { icon: '🤖', title: 'IA au service de la vérité', sub: 'Analyse NLP + base de données Sahel' },
  { icon: '📚', title: 'Apprenez à détecter', sub: 'Fiches pédagogiques anti-désinformation' },
];

export default function Onboarding() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      {/* Glow cercle */}
      <View style={styles.glow} />
      <Text style={styles.icon}>{SLIDES[0].icon}</Text>
      <Text style={styles.title}>{SLIDES[0].title}</Text>
      <Text style={styles.sub}>{SLIDES[0].sub}</Text>

      {/* Dots */}
      <View style={styles.dots}>
        {SLIDES.map((_, i) => (
          <View key={i} style={[styles.dot, i === 0 && styles.dotActive]} />
        ))}
      </View>

      <View style={styles.actions}>
        <Button label="Commencer " onPress={() => router.push('/(auth)/register')} fullWidth />
        <Text style={styles.link} onPress={() => router.push('/(auth)/login')}>
          Déjà un compte ?  <Text style={{ color: Colors.accent }}>Se connecter</Text>
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.bg, alignItems: 'center', justifyContent: 'center', padding: 28 },
  glow: { width: 200, height: 200, borderRadius: 100, backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: Colors.accent, position: 'absolute', top: '25%' },
  icon: { fontSize: 64, marginBottom: 24 },
  title: { fontSize: 26, fontWeight: '800', color: Colors.white, textAlign: 'center', marginBottom: 12 },
  sub:   { fontSize: 15, color: Colors.gray, textAlign: 'center', marginBottom: 40 },
  dots:  { flexDirection: 'row', gap: 10, marginBottom: 48 },
  dot:   { width: 8, height: 8, borderRadius: 4, backgroundColor: Colors.border },
  dotActive: { backgroundColor: Colors.accent, width: 24 },
  actions: { width: '100%', gap: 16, alignItems: 'center' },
  link: { color: Colors.gray, fontSize: 14 },
});
