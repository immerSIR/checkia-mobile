import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/profile.styles';
import { P } from '../../constants/colors';

type MenuItem = {
  icon: any;
  label: string;
  value?: string;
  onPress?: () => void;
};

export const MenuRow = ({ item, isLast }: { item: MenuItem; isLast: boolean }) => (
  <TouchableOpacity
    style={[s.menuRow, !isLast && s.menuRowBorder]}
    activeOpacity={0.7}
    onPress={item.onPress}
    disabled={!item.onPress}
  >
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 14 }}>
      <Ionicons name={item.icon} size={20} color={P.text} />
      <Text style={s.menuText}>{item.label}</Text>
    </View>
    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
      {item.value && <Text style={s.menuValue}>{item.value}</Text>}
      <Ionicons name="chevron-forward" size={16} color={P.muted} />
    </View>
  </TouchableOpacity>
);
