import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { P, s } from '../../styles/verify.styles';

type Props = {
  onBack: () => void;
};

export default function VerifyNavbar({ onBack }: Props) {
  return (
    <View style={s.navbar}>
      <TouchableOpacity style={s.navCircleBtn} onPress={onBack}>
        <Ionicons name="arrow-back" size={18} color={P.text} />
      </TouchableOpacity>

      <Text style={s.navTitle}>NOUVELLE VÉRIFICATION</Text>

      <TouchableOpacity style={s.navCircleBtn}>
        <Ionicons name="ellipsis-horizontal" size={18} color={P.text} />
      </TouchableOpacity>
    </View>
  );
}