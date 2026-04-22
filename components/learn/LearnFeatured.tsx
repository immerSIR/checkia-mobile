import { View, Text, TouchableOpacity } from 'react-native';
import { s } from '../../styles/learn.styles';
import { Ionicons } from '@expo/vector-icons';

export const LearnFeatured = ({ onPress }: { onPress: () => void }) => (
  <TouchableOpacity style={s.featured} onPress={onPress} activeOpacity={0.88}>
    <Text style={s.featKicker}>— À LA UNE · 5 MIN</Text>
    <Text style={s.featTitle}>
      {'Désinformation au Sahel : repérer les \n'}
      <Text style={s.featTitleItalic}>{' '}fausses nouvelles.</Text>
    </Text>
    <View style={s.featAuthorRow}>
      <View style={s.featAvatar}><Ionicons name="person" size={10} color="rgba(255,255,255,0.6)" /></View>
      <Text style={s.featAuthor}>Aïssatou Diallo · éditeur</Text>
    </View>
  </TouchableOpacity>
);