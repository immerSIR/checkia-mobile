// app/(auth)/register.tsx
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

const PAYS = ['Mali · Bamako', 'Sénégal', 'Côte d\'Ivoire', 'Burkina Faso', 'Niger', 'Guinée'];

export default function Register() {
  const router = useRouter();
  const [firstName, setFirstName] = useState('');
  const [lastName,  setLastName]  = useState('');
  const [email,     setEmail]     = useState('');
  const [password,  setPassword]  = useState('');
  const [showPwd,   setShowPwd]   = useState(false);
  const [pays,      setPays]      = useState('Mali · Bamako');
  const [showPays,  setShowPays]  = useState(false);
  const [cgu,       setCgu]       = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  const validate = () => {
    if (!firstName || !lastName || !email || !password) {
      setError('Veuillez remplir tous les champs.');
      return false;
    }
    if (!cgu) {
      setError('Veuillez accepter les conditions d\'utilisation.');
      return false;
    }
    if (password.length < 8) {
      setError('Le mot de passe doit contenir au moins 8 caractères.');
      return false;
    }
    return true;
  };

  const handleRegister = async () => {
    if (!validate()) return;
    setLoading(true);
    setError('');
    try {
      await authAPI.register({
        first_name: firstName,
        last_name:  lastName,
        country: pays,
        email,
        password,
      });
      const session = await authAPI.getSession();
      router.replace(session ? '/(tabs)' : '/(auth)/login');
    } catch (err: any) {
      const msg = err.message || 'Une erreur est survenue.';
      setError(msg);
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

        {/* ── Top bar : retour + dots ── */}
        <View style={s.topBar}>
          <TouchableOpacity
            style={s.back}
            onPress={() => router.back()}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.ink} />
          </TouchableOpacity>
          <View style={s.dots}>
            <View style={s.dot} />
            <View style={[s.dot, s.dotActive]} />
          </View>
          <View style={s.back} />
        </View>

        {/* ── Kicker ── */}
        <Text style={s.kicker}>— NOUVEAU COMPTE</Text>

        {/* ── Titre ── */}
        <Text style={s.title}>
          Rejoignez{'\n'}la communauté.
        </Text>

        {/* ── Erreur globale ── */}
        {error ? (
          <View style={s.errorBox}>
            <Ionicons name="alert-circle-outline" size={15} color={Colors.false} />
            <Text style={s.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Prénom / Nom ── */}
        <View style={s.row}>
          <View style={s.rowItem}>
            <Text style={s.label}>PRÉNOM</Text>
            <Input
              placeholder="Ibrahima"
              value={firstName}
              onChangeText={setFirstName}
            />
          </View>
          <View style={s.rowItem}>
            <Text style={s.label}>NOM</Text>
            <Input
              placeholder="Koné"
              value={lastName}
              onChangeText={setLastName}
            />
          </View>
        </View>

        {/* ── Email ── */}
        <Text style={s.label}>EMAIL</Text>
        <Input
          placeholder="nom@exemple.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={
            <Ionicons name="mail-outline" size={18} color={Colors.ink3} />
          }
        />

        {/* ── Mot de passe ── */}
        <Text style={s.label}>MOT DE PASSE</Text>
        <Input
          placeholder="••••••"
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

        {/* ── Pays · Région ── */}
        <Text style={s.label}>PAYS · RÉGION</Text>
        <TouchableOpacity
          style={s.paysSelect}
          onPress={() => setShowPays(v => !v)}
          activeOpacity={0.8}
        >
          <Ionicons name="location-outline" size={18} color={Colors.ink3} style={s.paysIcon} />
          <Text style={s.paysText}>{pays}</Text>
          <Ionicons name="chevron-down" size={16} color={Colors.ink3} />
        </TouchableOpacity>

        {/* Dropdown pays */}
        {showPays && (
          <View style={s.dropdown}>
            {PAYS.map(p => (
              <TouchableOpacity
                key={p}
                style={s.dropdownItem}
                onPress={() => { setPays(p); setShowPays(false); }}
              >
                <Text style={[
                  s.dropdownText,
                  p === pays && s.dropdownTextActive,
                ]}>
                  {p}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* ── CGU checkbox ── */}
        <TouchableOpacity
          style={s.cguWrap}
          onPress={() => setCgu(v => !v)}
          activeOpacity={0.8}
        >
          <View style={[s.checkbox, cgu && s.checkboxChecked]}>
            {cgu && (
              <Ionicons name="checkmark" size={13} color={Colors.bg} />
            )}
          </View>
          <Text style={s.cguText}>
            J'accepte les Conditions d'utilisation et la Politique de confidentialité.
            J'accepte aussi de partager mes vérifications de manière anonyme pour la recherche.
          </Text>
        </TouchableOpacity>

        {/* ── CTA ── */}
        <Button
          label="Créer mon compte"
          onPress={handleRegister}
          loading={loading}
          fullWidth
        />

        {/* ── Footer ── */}
        <Text style={s.footerText}>
          Déjà un compte ?{' '}
          <Text
            style={s.footerLink}
            onPress={() => router.push('/(auth)/login')}
          >
            Se connecter
          </Text>
        </Text>

      </ScrollView>
    </SafeAreaView>
  );
}

const s = StyleSheet.create({
  safe: {
    flex:            1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow:          1,
    paddingHorizontal: 28,
    paddingTop:        16,
    paddingBottom:     40,
  },

  // ── Top bar ──────────────────────────────────
  topBar: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'space-between',
    marginBottom:   28,
  },
  back: {
    width:          32,
    height:         32,
    alignItems:     'center',
    justifyContent: 'center',
  },
  dots: {
    flexDirection: 'row',
    gap:           8,
    alignItems:    'center',
  },
  dot: {
    width:           28,
    height:          4,
    borderRadius:    2,
    backgroundColor: Colors.rule,
  },
  dotActive: {
    backgroundColor: Colors.ink,
  },

  // ── Kicker ───────────────────────────────────
  kicker: {
    fontSize:      11,
    letterSpacing: 1.8,
    color:         Colors.accent,
    fontWeight:    '600',
    marginBottom:  12,
  },

  // ── Titre ────────────────────────────────────
  title: {
    fontSize:      26,
    lineHeight:    36,
    fontWeight:    '400',
    color:         Colors.ink,
    letterSpacing: -0.5,
    marginBottom:  28,
    fontFamily:    'InstrumentSerif-Regular',
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
  },

  // ── Label ────────────────────────────────────
  label: {
    fontSize:      10,
    letterSpacing: 1.4,
    color:         Colors.ink3,
    fontWeight:    '600',
    marginBottom:  8,
    textTransform: 'uppercase',
  },

  // ── Row prénom / nom ─────────────────────────
  row: {
    flexDirection: 'row',
    gap:           12,
    marginBottom:  4,
  },
  rowItem: {
    flex: 1,
  },

  // ── Pays select ──────────────────────────────
  paysSelect: {
    flexDirection:    'row',
    alignItems:       'center',
    minHeight:        54,
    backgroundColor:  Colors.inputBg,
    borderWidth:      1.5,
    borderColor:      Colors.inputBorder,
    borderRadius:     14,
    paddingHorizontal: 16,
    marginBottom:     16,
  },
  paysIcon: {
    marginRight: 10,
  },
  paysText: {
    flex:      1,
    fontSize:  15,
    color:     Colors.ink,
  },

  // ── Dropdown ─────────────────────────────────
  dropdown: {
    backgroundColor: Colors.bg,
    borderWidth:     1.5,
    borderColor:     Colors.inputBorder,
    borderRadius:    14,
    marginTop:       -12,
    marginBottom:    16,
    overflow:        'hidden',
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical:   14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.rule,
  },
  dropdownText: {
    fontSize: 14,
    color:    Colors.ink2,
  },
  dropdownTextActive: {
    color:      Colors.accent,
    fontWeight: '600',
  },

  // ── CGU ──────────────────────────────────────
  cguWrap: {
    flexDirection:  'row',
    alignItems:     'flex-start',
    gap:            12,
    marginBottom:   24,
    marginTop:      8,
  },
  checkbox: {
    width:           22,
    height:          22,
    borderRadius:    6,
    borderWidth:     1.5,
    borderColor:     Colors.inputBorder,
    backgroundColor: Colors.inputBg,
    alignItems:      'center',
    justifyContent:  'center',
    marginTop:       1,
    flexShrink:      0,
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor:     Colors.accent,
  },
  cguText: {
    flex:       1,
    fontSize:   10,
    lineHeight: 19,
    color:      Colors.ink3,
  },
  cguLink: {
    color:               Colors.accent,
    fontWeight:          '600',
    textDecorationLine:  'underline',
  },

  // ── Footer ───────────────────────────────────
  footerText: {
    textAlign:  'center',
    color:      Colors.ink3,
    fontSize:   14,
    marginTop:  20,
    marginBottom: 8,
  },
  footerLink: {
    color:               Colors.ink,
    fontWeight:          '700',
    textDecorationLine:  'underline',
  },

    // ── Home indicator ───────────────────────────
    homeIndicator: {
      alignSelf:       'center',
      width:           120,
      height:          5,
      borderRadius:    999,
      backgroundColor: Colors.rule,
      marginTop:       16,
    },
  });
