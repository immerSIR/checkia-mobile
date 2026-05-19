import { View, Text, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { s } from '../../styles/home.styles';
import { P } from '../../constants/colors';
import { timeAgo, getVerdictUI } from '../../utils/homeHelpers';

const getHistoryIcon = (item: any) => {
  const type = (item.input_type || item.type || '').toLowerCase();
  const text = (item.raw_input || '').toLowerCase();

  if (type.includes('url') || text.startsWith('http')) return 'link-outline';
  if (type.includes('image') || type.includes('photo')) return 'image-outline';
  if (type.includes('audio') || type.includes('son')) return 'mic-outline';
  return 'document-text-outline';
};

export const HistoryRow = ({ item, isLast, onPress }: any) => {
  const ui = getVerdictUI(item.verdict);
  const icon = getHistoryIcon(item);
  const domain = item.source || 'benbere.com';
  const verdictText = item.verdict === 'VRAI'
    ? '✓ VRAI'
    : item.verdict === 'FAUX'
      ? '× FAUX'
      : ui.label;

  return (
    <TouchableOpacity style={[s.listItem, !isLast && s.listBorder]} onPress={onPress}>
      <View style={s.listIconWrap}>
        <Ionicons name={icon as any} size={17} color={P.muted} />
      </View>

      <View style={s.listBody}>
        <View style={[s.pill, { backgroundColor: ui.bg }]}>
          <Text style={[s.pillText, { color: ui.color }]}>
            {verdictText}
          </Text>
        </View>

        <Text style={s.listTitle} numberOfLines={2}>
          {item.raw_input}
        </Text>

        <Text style={s.metaText}>
          {domain} · {timeAgo(item.created_at)}
        </Text>
      </View>

      {typeof item.score === 'number' && (
        <View style={{ justifyContent: 'flex-end', paddingBottom: 2 }}>
          <Text style={[s.score, { color: P.muted }]}>
            {item.score}%
          </Text>
        </View>
      )}
    </TouchableOpacity>
  );
};
