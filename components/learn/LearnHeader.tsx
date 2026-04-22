import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/learn.styles';
import { P } from '../../constants/colors';

export const LearnHeader = () => (
  <View style={s.header}>
    <Text style={s.headerKicker}>— FICHES PÉDAGOGIQUES</Text>
    <TouchableOpacity activeOpacity={0.7}>
      <Ionicons name="search-outline" size={20} color={P.text} />
    </TouchableOpacity>
  </View>
);