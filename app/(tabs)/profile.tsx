// app/(tabs)/profile.tsx
import { ScrollView, View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { P } from '../../constants/colors';
import { s } from '../../styles/profile.styles';
import { HomeStats } from '../../components/home/HomeStats';
import { MenuRow } from '../../components/profile/MenuRow';
import { authAPI } from '../../services/api';
import { useCurrentUser } from '../../hooks/useCurrentUser';

const MENU = [
  { icon: 'notifications-outline', label: 'Notifications', value: 'Activées' },
  { icon: 'globe-outline', label: 'Langue', value: 'Français' },
  { icon: 'moon-outline', label: 'Mode sombre', value: 'Automatique' },
  { icon: 'share-social-outline', label: "Partager l'app" },
  { icon: 'lock-closed-outline', label: 'Confidentialité' },
];

export default function Profile() {
  const router = useRouter();
  const { user } = useCurrentUser();

  const stats = { suivi: 24, vrai: 18, faux: 6 };

  const handleLogout = async () => {
    await authAPI.logout();
    router.replace('/(auth)/login');
  };

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
          <TouchableOpacity style={s.settingsButton}>
            <Ionicons name="settings-outline" size={18} color={P.muted} />
          </TouchableOpacity>
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
            <View style={s.verifiedBadge}>
              <Text style={s.verifiedText}>VÉRIFIÉ · VRAI</Text>
            </View>
          </View>
        </View>

        <HomeStats stats={stats} />

        <TouchableOpacity style={s.streakCard} activeOpacity={0.9}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={s.streakIconWrap}>
              <Ionicons name="flame" size={18} color="#B8680A" />
            </View>
            <View>
              <Text style={s.streakEyebrow}>SÉRIE</Text>
              <Text style={s.streakTitle}>12 jours consécutifs</Text>
            </View>
          </View>
          <Ionicons name="chevron-forward" size={18} color={P.muted} />
        </TouchableOpacity>

        <Text style={s.sectionLabel}>— PARAMÈTRES</Text>
        <View style={{ marginBottom: 20 }}>
          {MENU.map((item, i) => (
            <MenuRow key={item.label} item={item} isLast={i === MENU.length - 1} />
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
