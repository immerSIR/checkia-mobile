import { Text, TouchableOpacity, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { TABS, Tab } from '../../constants/verify';
import { s } from '../../styles/verify.styles';
import { P } from "../../constants/colors";

type Props = {
  tab: Tab;
  onChange: (tab: Tab) => void;
};

export default function VerifyTabs({ tab, onChange }: Props) {
  return (
    <View style={s.tabs}>
      {TABS.map((item) => (
        <TouchableOpacity
          key={item.key}
          style={[s.tab, tab === item.key && s.tabActive]}
          onPress={() => onChange(item.key)}
          activeOpacity={0.8}
        >
          <Ionicons name={item.icon} size={13} color={tab === item.key ? P.navy : P.muted} />
          <Text style={[s.tabText, tab === item.key && s.tabTextActive]}>
            {item.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
}