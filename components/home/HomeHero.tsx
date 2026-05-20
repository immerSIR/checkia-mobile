import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/home.styles';
import { P } from '../../constants/colors';

export const HomeHero = () => {
  const router = useRouter();
  return (
    <View style={s.heroCard}>
      <Text style={s.heroEyebrow}>— VÉRIFICATION EXPRESS</Text>
      <Text style={s.heroTitle}>Analysez une {'\n'}<Text style={s.heroItalic}>information</Text> douteuse.</Text>
      <Text style={s.heroSub}>Texte · Image</Text>
      <TouchableOpacity style={s.heroBtn} onPress={() => router.push('/verify')}>
        <Text style={s.heroBtnText}>Lancer une vérification</Text>
        <Ionicons name="arrow-forward" size={18} color={P.text} />
      </TouchableOpacity>
    </View>
  );
};