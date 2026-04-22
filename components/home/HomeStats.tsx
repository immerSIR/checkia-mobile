import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { s } from '../../styles/home.styles';
import { P } from '../../constants/colors';

export const HomeStats = ({ stats }: any) => {
  const router = useRouter();
  return (
    <View style={s.statsRow}>
      <StatCard label="Vérifications" value={stats.suivi} bg={P.statBeige} onPress={() => router.push('/history')} />
      <StatCard label="Vraies" value={stats.vrai} bg={P.statGreen} color={P.vrai} />
      <StatCard label="Fausses" value={stats.faux} bg={P.statPink} color={P.faux} />
    </View>
  );
};

const StatCard = ({ label, value, bg, color, onPress }: any) => (
  <TouchableOpacity style={[s.statCard, { backgroundColor: bg }]} onPress={onPress} disabled={!onPress}>
    <Text style={[s.statValue, { color: color || P.text }]}>{value}</Text>
    <Text style={s.statLabel}>{label}</Text>
  </TouchableOpacity>
);