import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/learn.styles';
import { P } from '../../constants/colors';

export const ArticleRow = ({ a, isLast, onPress }: any) => (
  <TouchableOpacity
    style={[s.articleRow, !isLast && s.articleRowSep]}
    onPress={onPress}
    activeOpacity={0.75}
  >
    <Text style={s.articleNum}>{a.num}</Text>
    <View style={s.articleBody}>
      <Text style={s.articleMeta}>{a.cat} · {a.dur}</Text>
      <Text style={s.articleTitle}>{a.title}</Text>
    </View>
    <Ionicons name="chevron-forward" size={16} color={P.muted} />
  </TouchableOpacity>
);