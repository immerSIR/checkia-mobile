// app/(tabs)/profile.tsx
import { ScrollView, View, Text, TouchableOpacity, StatusBar, Share } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { P } from '../../constants/colors';
import { s } from '../../styles/profile.styles';
import { MenuRow } from '../../components/profile/MenuRow';
import { authAPI } from '../../services/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

export default function Profile() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const handleLogout = async () => {
    await authAPI.logout();
    router.replace('/(auth)/login');
  };

  const handleShareApp = async () => {
    try {
      await Share.share({
        message:
          "Check-IA : un outil de fact-checking IA pour l'Afrique francophone. Découvrez l'app.",
      });
    } catch {
      // user dismissed
    }
  };

  const menu = [
    {
      icon: 'share-social-outline' as const,
      label: "Partager l'app",
      onPress: handleShareApp,
    },
  ];

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" />
      <ScrollView
        style={s.screen}
        contentContainerStyle={[s.container, { paddingBottom: 100 }]}
        showsVerticalScrollIndicator={false}
      >
        <View style={s.topBar}>
          <Text style={s.topLabel}>— MON COMPTE</Text>
        </View>

        <View style={s.profileRow}>
          <View style={s.avatar}>
            <Text style={s.avatarText}>{user.initials}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={s.name}>{user.fullName || user.email || 'Utilisateur'}</Text>
            {user.country ? (
              <View style={s.locationRow}>
                <Ionicons name="location-outline" size={13} color={P.muted} />
                <Text style={s.location}>{user.country}</Text>
              </View>
            ) : null}
            {user.email ? <Text style={s.location}>{user.email}</Text> : null}
          </View>
        </View>

        <Text style={s.sectionLabel}>— PARAMÈTRES</Text>
        <View style={{ marginBottom: 20 }}>
          {menu.map((item, i) => (
            <MenuRow key={item.label} item={item} isLast={i === menu.length - 1} />
          ))}
          <TouchableOpacity style={s.logoutRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color={P.danger} />
            <Text style={s.logoutText}>Se déconnecter</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
