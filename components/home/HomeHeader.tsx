import { View, Text, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { s } from '../../styles/home.styles';
import { getDayLabel } from '../../utils/homeHelpers';

export const HomeHeader = ({ name }: { name: string }) => {
  const router = useRouter();
  return (
    <>
      <View style={s.topBar}><Text style={s.dateLabel}>{getDayLabel()}</Text></View>
      <View style={s.header}>
        <View style={{ flex: 1 }}>
          <Text style={s.hello}>Bonjour{'\n'}{name},</Text>
          <Text style={s.sub}>Que vérifions-nous aujourd'hui ?</Text>
        </View>
        <TouchableOpacity style={s.avatar} onPress={() => router.push('/profile')}>
          <Text style={s.avatarText}>IK</Text>
        </TouchableOpacity>
      </View>
    </>
  );
};