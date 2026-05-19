import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { s } from '../../styles/home.styles';
import { getDayLabel } from '../../utils/homeHelpers';

type Props = {
  name: string;
  initials: string;
};

export const HomeHeader = ({ name, initials }: Props) => {
  const router = useRouter();
  const greeting = name ? `Bonjour\n${name},` : 'Bonjour,';
  return (
    <>
      <View style={s.topBar}>
        <Text style={s.dateLabel}>{getDayLabel()}</Text>
      </View>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.hello}>{greeting}</Text>
          <Text style={s.sub}>Que vérifions-nous aujourd'hui ?</Text>
        </View>
        <TouchableOpacity style={s.avatar} onPress={() => router.push('/profile')}>
          <Text style={s.avatarText}>{initials}</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};
