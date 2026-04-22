import { Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/learn.styles';
import { P } from '../../constants/colors';

interface CatProps { icon: any; lb: string; count: number }

export const CategoryCard = ({ icon, lb, count }: CatProps) => (
  <TouchableOpacity style={s.catCard} activeOpacity={0.8}>
    <Ionicons name={icon} size={20} color={P.navy} style={{ marginBottom: 8 }} />
    <Text style={s.catLabel}>{lb}</Text>
    <Text style={s.catCount}>{count} fiches</Text>
  </TouchableOpacity>
);