import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input }  from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { authAPI } from '../../services/api';

export default function Login() {
  const router = useRouter();
  const [username,    setUsername]    = useState('');
  const [password, setPassword] = useState('');
  const [showPwd,  setShowPwd]  = useState(false);
  const [loading,  setLoading]  = useState(false);
  const [error,    setError]    = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const { data } = await authAPI.login(username.trim(), password);
      if (!data.session?.access_token) {
        throw new Error('Aucune session reçue de Supabase.');
      }
      router.replace('/(tabs)');
    } catch (err: any) {
      if (err.status === 400 || err.status === 401) {
        setError('Adresse e-mail ou mot de passe incorrect.');
      } else {
        setError(err.message || 'Erreur réseau. Vérifiez votre connexion.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
      <ScrollView
        contentContainerStyle={s.scroll}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {/* ── Header ── */}
        <View style={s.header}>
          <TouchableOpacity
            style={s.back}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.ink} />
          </TouchableOpacity>
          <Text style={s.meta}>ETAPE 1/1</Text>
        </View>

        {/* ── Titre ── */}
        <Text style={s.title}>
          Bon rétour{'\n'}Parmi{' '}
          <Text style={s.titleItalic}>nous.</Text>
        </Text>
        <Text style={s.subtitle}>
          Connectez-vous pour retrouver vos vérifications
          et votre historique.
        </Text>

        {/* ── Séparateur ── */}
        {/* <View style={s.rule} /> */}

        {/* ── Erreur globale ── */}
        {error ? (
          <View style={s.errorBox}>
            <Ionicons name="alert-circle-outline" size={15} color={Colors.false} />
            <Text style={s.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Formulaire ── */}
        <Input
          label="Adresse e-mail"
          placeholder="vous@exemple.com"
          value={username}
          onChangeText={setUsername}
          // keyboardType="username-address"
          leftIcon={
            <Ionicons name="mail-outline" size={18} color={Colors.ink3} />
          }
        />

        <Input
          label="Mot de passe"
          placeholder="••••••••"
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!showPwd}
          leftIcon={
            <Ionicons name="lock-closed-outline" size={18} color={Colors.ink3} />
          }
          rightIcon={
            <Ionicons
              name={showPwd ? 'eye-off-outline' : 'eye-outline'}
              size={18}
              color={Colors.ink3}
            />
          }
          onRightIconPress={() => setShowPwd(v => !v)}
        />

        {/* ── Mot de passe oublié ── */}
        <TouchableOpacity
          style={s.forgotWrap}
          onPress={() => router.push('/(auth)/forgot-password')}
        >
          <Text style={s.forgot}>Mot de passe oublié ?</Text>
        </TouchableOpacity>

        {/* ── CTA principal ── */}
        <Button
          label="Se connecter"
          onPress={handleLogin}
          loading={loading}
          fullWidth
        />

        {/* ── Divider ── */}
        <View style={s.divider}>
          <View style={s.divLine} />
          <Text style={s.divText}>ou</Text>
          <View style={s.divLine} />
        </View>

        {/* ── Google ── */}
        <Button
          label="Continuer avec Google"
          onPress={() => {}}
          variant="secondary"
          fullWidth
          icon={
            <Ionicons name="logo-google" size={18} color={Colors.accent} />
          }
        />

        {/* ── Lien register ── */}
        <Text style={s.footerText}>
          Pas encore de compte ?{' '}
          <Text
            style={s.footerLink}
            onPress={() => router.push('/(auth)/register')}
          >
            S'inscrire
          </Text>
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow:        1,
    paddingHorizontal: 28,
    paddingTop:      24,
    paddingBottom:   48,
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection:  'row',
    justifyContent: 'space-between',
    alignItems:     'center',
    marginBottom:   40,
  },
  brand: {
    fontSize:      28,
    fontWeight:    '500',
    color:         Colors.ink,
    letterSpacing: -0.5,
    fontFamily:    'InstrumentSerif-Regular',
  },
  brandItalic: {
    fontStyle:  'italic',
    color:      Colors.accent,
    fontFamily: 'InstrumentSerif-Italic',
  },
  meta: {
    position:      'absolute',
    left:          0,
    right:         0,
    textAlign:     'center',
    fontFamily: 'Geist-Medium',
    fontSize: 10.5,
    lineHeight: 12,
    letterSpacing: 1.55,
    textTransform: 'uppercase',
    color: '#6E7690',
    includeFontPadding: false,
  },
  back: {
    width:          32,
    height:         32,
    alignItems:     'center',
    justifyContent: 'center',
  },

  // ── Titre ────────────────────────────────────
  title: {
    fontSize:      38,
    lineHeight:    44,
    fontWeight:    '400',
    color:         Colors.ink,
    letterSpacing: -0.5,
    marginBottom:  12,
    fontFamily:    'InstrumentSerif-Regular',
  },
  titleItalic: {
    fontStyle:  'italic',
    color:      Colors.accent,
    fontFamily: 'InstrumentSerif-Italic',
  },
  subtitle: {
    fontSize:     15,
    lineHeight:   23,
    color:        Colors.ink3,
    marginBottom: 28,
    fontFamily:   'Geist-Regular',
  },

  // ── Règle ────────────────────────────────────
  rule: {
    height:          1.5,
    backgroundColor: Colors.rule,
    marginBottom:    28,
  },

  // ── Erreur ───────────────────────────────────
  errorBox: {
    flexDirection:   'row',
    alignItems:      'center',
    gap:             8,
    backgroundColor: Colors.falseDim,
    borderWidth:     1,
    borderColor:     Colors.false,
    borderRadius:    12,
    padding:         14,
    marginBottom:    20,
  },
  errorBoxText: {
    color:      Colors.false,
    fontSize:   13,
    flex:       1,
    fontFamily: 'Geist-Regular',
  },

  // ── Mot de passe oublié ──────────────────────
  forgotWrap: {
    alignSelf:    'flex-end',
    marginBottom: 24,
    marginTop:    -4,
  },
  forgot: {
    color:         Colors.accent,
    fontSize:      13,
    fontWeight:    '600',
    fontFamily:    'Geist-SemiBold',
    letterSpacing: 0.2,
  },

  // ── Divider ──────────────────────────────────
  divider: {
    flexDirection:  'row',
    alignItems:     'center',
    gap:            12,
    marginVertical: 20,
  },
  divLine: {
    flex:            1,
    height:          1,
    backgroundColor: Colors.rule,
  },
  divText: {
    color:      Colors.ink3,
    fontSize:   12,
    fontFamily: 'Geist-Regular',
  },

  // ── Footer ───────────────────────────────────
  footerText: {
    textAlign:  'center',
    color:      Colors.ink3,
    fontSize:   14,
    marginTop:  24,
    fontFamily: 'Geist-Regular',
  },
  footerLink: {
    color:      Colors.accent,
    fontWeight: '700',
    fontFamily: 'Geist-SemiBold',
    textDecorationLine: 'underline',
  },
});
