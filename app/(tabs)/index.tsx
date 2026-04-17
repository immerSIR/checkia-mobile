import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors } from '../../constants/colors';
import { factCheckAPI } from '../../services/api';
import * as SecureStore from 'expo-secure-store';

type FactCheck = {
  id: string;
  raw_input: string;
  verdict: 'VRAI' | 'FAUX' | 'DOUTEUX';
  created_at: string;
  input_type: string;
};

const VERDICT_COLOR: Record<string, string> = {
  VRAI:    Colors.true   ?? '#00D4AA',
  FAUX:    Colors.false  ?? '#FF4C4C',
  DOUTEUX: Colors.warning   ?? '#F5A623',
};

const VERDICT_BG: Record<string, string> = {
  VRAI:    Colors.trueDim   ?? '#00D4AA22',
  FAUX:    Colors.falseDim  ?? '#FF4C4C22',
  DOUTEUX: Colors.warnDim   ?? '#F5A62322',
};

function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 24) return `${h}h`;
  return `${Math.floor(h / 24)}j`;
}

export default function HomeScreen() {
  const router = useRouter();
  const [userName, setUserName] = useState('');
  const [history, setHistory] = useState<FactCheck[]>([]);
  const [stats, setStats] = useState({ vrai: 0, suivi: 0, faux: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const { data } = await factCheckAPI.getHistory();
      const items: FactCheck[] = data.results ?? data;
      setHistory(items.slice(0, 5));
      setStats({
        vrai:  items.filter(i => i.verdict === 'VRAI').length,
        suivi: items.length,
        faux:  items.filter(i => i.verdict === 'FAUX').length,
      });
    } catch {
      // API pas encore dispo, on laisse vide
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.hello}>Bonjour, {userName || 'Ibrahima'} 👋</Text>
          <Text style={styles.sub}>Que vérifies-tu aujourd'hui ?</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>IK</Text>
        </View>
      </View>

      {/* CTA Vérifier */}
      <View style={styles.cta}>
        <View style={styles.ctaIcon}>
          <Ionicons name="shield-checkmark" size={20} color={Colors.accent} />
          <Text style={styles.ctaTitle}>Vérifier une information</Text>
        </View>
        <Text style={styles.ctaSub}>Texte · URL · Image · Son</Text>
        <TouchableOpacity style={styles.ctaBtn} onPress={() => router.push('/(tabs)/verify')}>
          <Text style={styles.ctaBtnText}>Lancer </Text>
        </TouchableOpacity>
      </View>

      {/* Stats */}
      <View style={styles.statsRow}>
        {[
          { label: 'Vrai',   value: stats.vrai,  color: '#00D4AA' },
          { label: 'Suivi',  value: stats.suivi, color: Colors.white },
          { label: 'Faux',   value: stats.faux,  color: '#FF4C4C' },
        ].map(s => (
          <View key={s.label} style={styles.statBox}>
            <Text style={[styles.statValue, { color: s.color }]}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* Récentes */}
      <Text style={styles.sectionTitle}>Récentes</Text>

      {loading ? (
        <ActivityIndicator color={Colors.accent} style={{ marginTop: 20 }} />
      ) : history.length === 0 ? (
        <Text style={styles.empty}>Aucune vérification pour l'instant.</Text>
      ) : (
        history.map(item => (
          <TouchableOpacity
            key={item.id}
            style={styles.card}
            onPress={() => router.push(`/(tabs)/verify?id=${item.id}`)}
          >
            <View style={styles.cardLeft}>
              <Text style={styles.cardType}>{item.input_type}</Text>
              <Text style={styles.cardText} numberOfLines={1}>{item.raw_input}</Text>
            </View>
            <View style={styles.cardRight}>
              <View style={[styles.badge, { backgroundColor: VERDICT_BG[item.verdict] }]}>
                <Text style={[styles.badgeText, { color: VERDICT_COLOR[item.verdict] }]}>
                  {item.verdict}
                </Text>
              </View>
              <Text style={styles.cardTime}>{timeAgo(item.created_at)}</Text>
            </View>
          </TouchableOpacity>
        ))
      )}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen:     { flex: 1, backgroundColor: Colors.bg },
  container:  { padding: 22, paddingBottom: 40 },

  // Header
  header:     { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, marginTop: 12 },
  hello:      { fontSize: 20, fontWeight: '800', color: Colors.white },
  sub:        { fontSize: 13, color: Colors.gray, marginTop: 2 },
  avatar:     { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center' },
  avatarText: { color: Colors.bg, fontWeight: '800', fontSize: 13 },

  // CTA
  cta:        { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 16, padding: 18, marginBottom: 20 },
  ctaIcon:    { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  ctaTitle:   { color: Colors.white, fontWeight: '700', fontSize: 15 },
  ctaSub:     { color: Colors.gray, fontSize: 12, marginBottom: 14 },
  ctaBtn:     { backgroundColor: Colors.accent, borderRadius: 10, paddingVertical: 12, alignItems: 'center' },
  ctaBtnText: { color: Colors.bg, fontWeight: '800', fontSize: 14 },

  // Stats
  statsRow:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 24, gap: 10 },
  statBox:    { flex: 1, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, alignItems: 'center' },
  statValue:  { fontSize: 22, fontWeight: '800' },
  statLabel:  { fontSize: 11, color: Colors.gray, marginTop: 2 },

  // Récentes
  sectionTitle: { color: Colors.white, fontWeight: '700', fontSize: 15, marginBottom: 12 },
  empty:        { color: Colors.gray, fontSize: 13, textAlign: 'center', marginTop: 20 },
  card:         { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border, borderRadius: 12, padding: 14, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardLeft:     { flex: 1, marginRight: 10 },
  cardType:     { color: Colors.gray, fontSize: 11, marginBottom: 2, textTransform: 'uppercase' },
  cardText:     { color: Colors.white, fontSize: 13, fontWeight: '600' },
  cardRight:    { alignItems: 'flex-end', gap: 4 },
  badge:        { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:    { fontSize: 11, fontWeight: '700' },
  cardTime:     { color: Colors.gray, fontSize: 11 },
});
