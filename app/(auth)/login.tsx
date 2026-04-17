import { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Input } from '../../components/ui/Input';
import { Button } from '../../components/ui/Button';
import { Colors } from '../../constants/colors';
import * as SecureStore from 'expo-secure-store';
import { authAPI } from '../../services/api'; // ← authAPI, plus axios direct

export default function Login() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    console.log('🚀 Tentative login:', email, password);
    if (!email || !password) {
      setError('Veuillez remplir tous les champs.');
      return;
    }
    setLoading(true); setError('');
    try {
      console.log('📡 Appel API vers:', `${authAPI}/auth/token/`);
      const { data } = await authAPI.login(email, password);
      await SecureStore.setItemAsync('token', data.access);         // ← 'token' cohérent
      await SecureStore.setItemAsync('refresh_token', data.refresh);
      router.replace('/(tabs)/');
    } catch (err: any) {
      // Affiche l'erreur exacte dans la console Expo
      console.log('STATUS:', err.response?.status);
      console.log('DATA:', JSON.stringify(err.response?.data));
      console.log('MESSAGE:', err.message);
    
      if (err.response?.status === 401) {
        setError('Email ou mot de passe incorrect.');
      } else {
        setError(`Erreur: ${err.response?.status} - ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Connexion</Text>
      <Text style={styles.sub}>Bienvenue sur Check-IA</Text>

      {error ? <Text style={styles.error}>{error}</Text> : null}

      <Input placeholder="📧  Email" value={email} onChangeText={setEmail} />
      <Input placeholder="🔒  Mot de passe" value={password} onChangeText={setPassword} secureTextEntry />

      <TouchableOpacity style={styles.forgot}>
        <Text style={styles.forgotText}>Mot de passe oublié ?</Text>
      </TouchableOpacity>

      <Button label="Se connecter" onPress={handleLogin} loading={loading} fullWidth />

      <View style={styles.divider}>
        <View style={styles.line}/><Text style={styles.divText}>ou</Text><View style={styles.line}/>
      </View>

      <Button label="🌐  Continuer avec Google" onPress={() => {}} variant="secondary" fullWidth />

      <Text style={styles.link} onPress={() => router.push('/(auth)/register')}>
        Pas de compte ?  <Text style={{ color: Colors.accent }}>S'inscrire </Text>
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flexGrow: 1, backgroundColor: Colors.bg, padding: 28, justifyContent: 'center' },
  title:     { fontSize: 28, fontWeight: '800', color: Colors.white, textAlign: 'center', marginBottom: 8 },
  sub:       { fontSize: 14, color: Colors.gray, textAlign: 'center', marginBottom: 32 },
  error:     { backgroundColor: Colors.falseDim, borderWidth: 1, borderColor: Colors.false, borderRadius: 8, padding: 12, color: Colors.false, marginBottom: 16, fontSize: 13 },
  forgot:    { alignSelf: 'flex-end', marginBottom: 20 },
  forgotText:{ color: Colors.accent, fontSize: 13 },
  divider:   { flexDirection: 'row', alignItems: 'center', marginVertical: 24, gap: 12 },
  line:      { flex: 1, height: 1, backgroundColor: Colors.border },
  divText:   { color: Colors.gray, fontSize: 13 },
  link:      { color: Colors.gray, fontSize: 14, textAlign: 'center', marginTop: 24 },
});
