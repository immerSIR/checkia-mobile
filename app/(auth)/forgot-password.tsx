import { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  StatusBar, TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Input }  from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import { api }    from '../../services/api';

type Step = 'email' | 'sent';

export default function ForgotPassword() {
  const router = useRouter();
  const [step,    setStep]    = useState<Step>('email');
  const [email,   setEmail]   = useState('');
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState('');

  const handleSend = async () => {
    if (!email.trim()) {
      setError('Veuillez saisir votre adresse e-mail.');
      return;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError('Adresse e-mail invalide.');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await api.post('/auth/password-reset/', { email });
      setStep('sent');
    } catch (err: any) {
      // On affiche toujours "envoyé" pour ne pas révéler si l'email existe
      setStep('sent');
    } finally {
      setLoading(false);
    }
  };

  // ── Écran de confirmation ────────────────────
  if (step === 'sent') {
    return (
      <SafeAreaView style={s.safe}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.bg} />
        <View style={s.centeredContainer}>

          {/* Icône succès */}
          <View style={s.successIcon}>
            <Ionicons name="mail-open-outline" size={40} color={Colors.accent} />
          </View>

          {/* Titre */}
          <Text style={s.title} testID="sent-title">
            Vérifiez votre{'\n'}
            <Text style={s.titleItalic}>messagerie.</Text>
          </Text>

          <Text style={s.subtitle}>
            Si un compte existe pour{' '}
            <Text style={s.emailHighlight}>{email}</Text>
            , vous recevrez un lien de réinitialisation dans quelques instants.
          </Text>

          {/* Règle */}
          <View style={s.rule} />

          {/* Note */}
          <View style={s.noteWrap}>
            <Ionicons name="information-circle-outline" size={15} color={Colors.ink3} />
            <Text style={s.noteText}>
              Pensez à vérifier vos spams si vous ne voyez pas l'e-mail.
            </Text>
          </View>

          {/* Renvoyer */}
          <Button
            label="Renvoyer le lien"
            onPress={() => setStep('email')}
            variant="secondary"
            fullWidth
          />

          {/* Retour login */}
          <TouchableOpacity
            style={s.backToLogin}
            onPress={() => router.replace('/(auth)/login')}
            activeOpacity={0.7}
          >
            <Ionicons name="arrow-back" size={16} color={Colors.accent} />
            <Text style={s.backToLoginText}>Retour à la connexion</Text>
          </TouchableOpacity>

        </View>
      </SafeAreaView>
    );
  }

  // ── Écran principal ──────────────────────────
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
          <Text style={s.brand}>
            Check<Text style={s.brandItalic}>·IA</Text>
          </Text>
          <Text style={s.meta}>BAMAKO · 2026</Text>
        </View>

        {/* ── Titre ── */}
        <Text style={s.title}>
          Mot de passe{'\n'}
          <Text style={s.titleItalic}>oublié ?</Text>
        </Text>
        <Text style={s.subtitle}>
          Saisissez votre adresse e-mail et nous vous{'\n'}
          enverrons un lien de réinitialisation.
        </Text>

        {/* ── Séparateur ── */}
        <View style={s.rule} />

        {/* ── Erreur ── */}
        {error ? (
          <View style={s.errorBox}>
            <Ionicons name="alert-circle-outline" size={15} color={Colors.false} />
            <Text style={s.errorBoxText}>{error}</Text>
          </View>
        ) : null}

        {/* ── Champ email ── */}
        <Input
          label="Adresse e-mail"
          placeholder="vous@exemple.com"
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          leftIcon={
            <Ionicons name="mail-outline" size={18} color={Colors.ink3} />
          }
        />

        {/* ── Info ── */}
        <View style={s.infoWrap}>
          <Ionicons name="shield-checkmark-outline" size={14} color={Colors.ink3} />
          <Text style={s.infoText}>
            Pour des raisons de sécurité, nous ne confirmons pas
            si l'adresse est enregistrée.
          </Text>
        </View>

        {/* ── CTA ── */}
        <Button
          label="Envoyer le lien"
          onPress={handleSend}
          loading={loading}
          fullWidth
        />

        {/* ── Retour login ── */}
        <TouchableOpacity
          style={s.backToLogin}
          onPress={() => router.replace('/(auth)/login')}
          activeOpacity={0.7}
        >
          <Ionicons name="arrow-back" size={16} color={Colors.accent} />
          <Text style={s.backToLoginText}>Retour à la connexion</Text>
        </TouchableOpacity>

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
    flex:            1,
    backgroundColor: Colors.bg,
  },
  scroll: {
    flexGrow:          1,
    paddingHorizontal: 28,
    paddingTop:        24,
    paddingBottom:     48,
  },

  // ── Écran centré (confirmation) ──────────────
  centeredContainer: {
    flex:              1,
    paddingHorizontal: 28,
    paddingTop:        60,
    paddingBottom:     48,
  },
  successIcon: {
    width:           80,
    height:          80,
    borderRadius:    40,
    backgroundColor: Colors.accentSoft,
    alignItems:      'center',
    justifyContent:  'center',
    marginBottom:    32,
  },

  // ── Header ──────────────────────────────────
  header: {
    flexDirection: 'row',
    alignItems:    'baseline',
    marginBottom:  40,
    gap:           12,
  },
  back: {
    marginRight: 4,
    marginBottom: 2,
  },
  brand: {
    fontSize:      28,
    fontWeight:    '500',
    color:         Colors.ink,
    letterSpacing: -0.5,
    fontFamily:    'InstrumentSerif-Regular',
    flex:          1,
  },
  brandItalic: {
    fontStyle:  'italic',
    color:      Colors.accent,
    fontFamily: 'InstrumentSerif-Italic',
  },
  meta: {
    fontSize:      10,
    letterSpacing: 2,
    color:         Colors.ink3,
    fontFamily:    'Geist-Regular',
    fontWeight:    '500',
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

  // ── Info / Note ──────────────────────────────
  infoWrap: {
    flexDirection: 'row',
    alignItems:    'flex-start',
    gap:           8,
    marginBottom:  24,
    paddingHorizontal: 4,
  },
  infoText: {
    flex:       1,
    fontSize:   12,
    lineHeight: 18,
    color:      Colors.ink3,
    fontFamily: 'Geist-Regular',
  },
  noteWrap: {
    flexDirection:   'row',
    alignItems:      'flex-start',
    gap:             8,
    backgroundColor: Colors.accentSoft,
    borderRadius:    12,
    padding:         14,
    marginBottom:    24,
  },
  noteText: {
    flex:       1,
    fontSize:   13,
    lineHeight: 19,
    color:      Colors.accent,
    fontFamily: 'Geist-Regular',
  },

  // ── Email highlight ───────────────────────────
  emailHighlight: {
    color:      Colors.accent,
    fontWeight: '600',
    fontFamily: 'Geist-SemiBold',
  },

  // ── Retour login ─────────────────────────────
  backToLogin: {
    flexDirection:  'row',
    alignItems:     'center',
    justifyContent: 'center',
    gap:            6,
    marginTop:      20,
    marginBottom:   8,
  },
  backToLoginText: {
    color:      Colors.accent,
    fontSize:   14,
    fontWeight: '600',
    fontFamily: 'Geist-SemiBold',
  },

  // ── Footer ───────────────────────────────────
  footerText: {
    textAlign:  'center',
    color:      Colors.ink3,
    fontSize:   14,
    marginTop:  16,
    fontFamily: 'Geist-Regular',
  },
  footerLink: {
    color:               Colors.accent,
    fontWeight:          '700',
    fontFamily:          'Geist-SemiBold',
    textDecorationLine:  'underline',
  },
});