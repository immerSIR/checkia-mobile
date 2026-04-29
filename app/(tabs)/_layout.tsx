import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, P } from '../../constants/colors';

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{
      headerShown: false,
      tabBarHideOnKeyboard: false, // STABLE : Ne bouge jamais, même avec le clavier
      tabBarSafeAreaInsets: { bottom: 0 }, // STABLE : Ignore les zones de sécurité système qui font varier la hauteur
      tabBarStyle: {
        backgroundColor: Colors.card,
        borderTopColor: Colors.border,
        height: 70,       // Hauteur fixe absolue
        paddingBottom: 12,
        paddingTop: 10,
        position: 'absolute', // Détaché du contenu pour ne pas être poussé
        bottom: 0,
        left: 0,
        right: 0,
        elevation: 0,     // Supprime l'ombre Android qui peut créer un saut visuel
        borderTopWidth: 1,
      },
      tabBarActiveTintColor: P.navy,
      tabBarInactiveTintColor: Colors.gray,
      tabBarLabelStyle: {
        fontSize: 11,
        fontWeight: '600',
        marginTop: 4,
      },
    }}>
      <Tabs.Screen name="index"   options={{ title: 'Accueil',  tabBarIcon: ({ color }) => <Ionicons name="home-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="verify"  options={{ title: 'Vérifier',   tabBarIcon: ({ color }) => <Ionicons name="search-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="learn"   options={{ title: 'Apprendre',tabBarIcon: ({ color }) => <Ionicons name="book-outline" size={24} color={color} /> }} />
      <Tabs.Screen name="profile" options={{ title: 'Profil',   tabBarIcon: ({ color }) => <Ionicons name="person-outline" size={24} color={color} /> }} />
    </Tabs>
  );
}
