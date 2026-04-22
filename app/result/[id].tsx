// app/result/[id].tsx
import {
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

// ── Palette exacte storyboard ─────────────────────
const P = {
  bg:         '#F7F3E9',
  surface:    '#FCFAF2',
  surfaceAlt: '#EEE8D6',
  white:      '#FFFFFF',
  text:       '#0F1E3D',
  muted:      '#6B7493',
  line:       '#E2DDCB',
  navy:       '#1E3A8A',
  navyDark:   '#10275A',
  green:      '#1B6B3C',
  greenLight: '#EBF4EF',
  greenBorder:'#A8D5BA',
  greenBar:   '#2D8A55',
  red:        '#B91C1C',
  warning:    '#B8860B',
  warningBg:  '#FDF8E7',
  warningLine:'#E8C97A',
};

// ── Données mock ──────────────────────────────────
const RESULT = {
  verdict:    'VRAI' as 'VRAI' | 'FAUX' | 'DOUTEUX',
  rapportNum: '024',
  date:       '12 MAR 2026',
  score:      87,
  scoreLabel: 'ÉLEVÉ',
  claim:      '« Le Mali va organiser un référendum constitutionnel en juin 2026 pour adopter une nouvelle constitution. »',
  analyse:    "Cette information est confirmée par ",
  analyseBold:"3 sources de fact-checking du Sahel",
  analyseEnd: ". Le décret présidentiel a été publié le 12 mars 2026 au Journal Officiel.",
  sources: [
    {
      name: 'benbere.com',
      date: '12 mars 2026',
      desc: 'Le décret N°2026-154 fixe la date du référendum au 21 juin.',
    },
    {
      name: 'voixdemopti.com',
      date: '10 mars 2026',
      desc: 'Préparatifs déjà engagés dans les régions.',
    },
    {
      name: 'AFP Fact Check',
      date: '11 mars 2026',
      desc: 'Information confirmée par deux sources gouvernementales.',
    },
  ],
};

export default function ResultScreen() {
  const router = useRouter();

  const verdictColor =
    RESULT.verdict === 'VRAI'   ? P.green   :
    RESULT.verdict === 'FAUX'   ? P.red     :
    P.warning;

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity style={s.circleBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={16} color={P.text} />
        </TouchableOpacity>
        <Text style={s.headerMeta}>
          Rapport N°{RESULT.rapportNum} · {RESULT.date}
        </Text>
        <TouchableOpacity style={s.circleBtn}>
          <Ionicons name="share-outline" size={16} color={P.text} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* ── Barre de confiance (visible au scroll) ── */}
        <View style={s.scoreSection}>
          <View style={s.scoreRow}>
            <Text style={s.scoreLabelText}>INDICE DE CONFIANCE</Text>
            <Text style={[s.scoreLevel, { color: verdictColor }]}>
              {RESULT.scoreLabel}
            </Text>
          </View>
          {/* Barre verte pleine */}
          <View style={s.barTrack}>
            <View style={[
              s.barFill,
              { width: `${RESULT.score}%` as any, backgroundColor: verdictColor },
            ]} />
          </View>
          <View style={s.barEndRow}>
            <Text style={s.barEnd}>0</Text>
            <Text style={[s.barCenter, { color: verdictColor }]}>
              {RESULT.score}%
            </Text>
            <Text style={s.barEnd}>100</Text>
          </View>
        </View>

        {/* ── L'affirmation vérifiée ── */}
        <Text style={s.sectionLabel}>— L'AFFIRMATION VÉRIFIÉE</Text>

        {/* Card avec bordure gauche verte + ombre + fond crème-vert */}
        <View style={s.claimCard}>
          <View style={[s.claimBorderLeft, { backgroundColor: verdictColor }]} />
          <Text style={s.claimText}>{RESULT.claim}</Text>
        </View>

        {/* ── L'analyse ── */}
        <Text style={s.sectionLabel}>— L'ANALYSE</Text>
        <Text style={s.analyseText}>
          {RESULT.analyse}
          <Text style={s.analyseBold}>{RESULT.analyseBold}</Text>
          {RESULT.analyseEnd}
        </Text>

        {/* ── Sources croisées ── */}
        <Text style={s.sectionLabel}>
          — SOURCES CROISÉES · {RESULT.sources.length}
        </Text>
        <View style={s.sourcesList}>
          {RESULT.sources.map((src, i) => (
            <View key={src.name}>
              <TouchableOpacity style={s.sourceRow} activeOpacity={0.75}>
                {/* Icône ✓ vert */}
                <View style={[s.sourceCheck, { backgroundColor: P.greenLight }]}>
                  <Ionicons name="checkmark" size={13} color={verdictColor} />
                </View>

                {/* Texte */}
                <View style={s.sourceText}>
                  <Text style={[s.sourceName, { color: verdictColor }]}>
                    {src.name}
                  </Text>
                  <Text style={s.sourceDesc} numberOfLines={2}>
                    {src.desc}
                  </Text>
                </View>

                {/* Date + chevron */}
                <View style={s.sourceRight}>
                  <Text style={s.sourceDate}>{src.date}</Text>
                  <Ionicons name="chevron-forward" size={13} color={P.muted} />
                </View>
              </TouchableOpacity>

              {i < RESULT.sources.length - 1 && (
                <View style={s.sourceSep} />
              )}
            </View>
          ))}
        </View>

        {/* ── Bannière disclaimer ── */}
        <View style={s.disclaimer}>
          <Ionicons name="warning-outline" size={15} color={P.warning} />
          <Text style={s.disclaimerText}>
            Résultat généré par IA — à considérer comme indicatif, non définitif.
          </Text>
        </View>

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* ── Barre d'actions fixe en bas ── */}
      <View style={s.actionBar}>
        <TouchableOpacity style={s.btnSecondary} activeOpacity={0.8}>
          <Ionicons name="share-outline" size={16} color={P.text} />
          <Text style={s.btnSecondaryText}>Partager</Text>
        </TouchableOpacity>

        <TouchableOpacity style={s.btnPrimary} activeOpacity={0.85}>
          <Ionicons name="bookmark-outline" size={16} color={P.white} />
          <Text style={s.btnPrimaryText}>Sauvegarder</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: P.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24 },

  // Header
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: P.line,
    backgroundColor: P.bg,
  },
  circleBtn: {
    width: 34, height: 34, borderRadius: 17,
    borderWidth: 1, borderColor: P.line,
    backgroundColor: P.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  headerMeta: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, color: P.muted,
  },

  // Score / confiance
  scoreSection: {
    marginTop: 8,
    marginBottom: 24,
  },
  scoreRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  scoreLabelText: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 1.2, color: P.muted,
  },
  scoreLevel: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 1.2,
  },
  barTrack: {
    width: '100%', height: 7,
    backgroundColor: P.surfaceAlt,
    borderRadius: 4, overflow: 'hidden',
    marginBottom: 5,
  },
  barFill: {
    height: 7, borderRadius: 4,
  },
  barEndRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barEnd:   { fontSize: 10, color: P.muted },
  barCenter:{ fontSize: 12, fontWeight: '700' },

  // Section label
  sectionLabel: {
    fontSize: 10, fontWeight: '700',
    letterSpacing: 1.4, color: P.muted,
    marginBottom: 12, marginTop: 4,
  },

  // ── Claim card : fond crème-vert + bordure gauche verte + ombre ──
  claimCard: {
    flexDirection: 'row',
    backgroundColor: '#F0F7F3',       // fond légèrement vert-crème
    borderWidth: 1,
    borderColor: '#C5E0CE',           // bordure vert clair
    borderRadius: 14,
    marginBottom: 24,
    overflow: 'hidden',
    // Ombre exacte maquette
    shadowColor: '#1B6B3C',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 8,
    elevation: 3,
  },
  claimBorderLeft: {
    width: 4,
    alignSelf: 'stretch',
    borderTopLeftRadius: 14,
    borderBottomLeftRadius: 14,
  },
  claimText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 22,
    color: P.text,
    fontStyle: 'italic',
    fontFamily: 'InstrumentSerif-Italic',
    paddingHorizontal: 14,
    paddingVertical: 16,
  },

  // Analyse
  analyseText: {
    fontSize: 14, lineHeight: 22,
    color: P.text, marginBottom: 28,
  },
  analyseBold: {
    fontWeight: '700',
    color: P.text,
    textDecorationLine: 'underline',
  },

  // Sources
  sourcesList: {
    backgroundColor: P.white,
    borderWidth: 1, borderColor: P.line,
    borderRadius: 16, overflow: 'hidden',
    marginBottom: 20,
  },
  sourceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16, paddingVertical: 14,
    gap: 12,
  },
  sourceSep: {
    height: 1, backgroundColor: P.line,
    marginLeft: 62,
  },
  sourceCheck: {
    width: 30, height: 30, borderRadius: 15,
    alignItems: 'center', justifyContent: 'center',
    flexShrink: 0,
  },
  sourceText: { flex: 1 },
  sourceName: {
    fontSize: 13, fontWeight: '700', marginBottom: 3,
  },
  sourceDesc: {
    fontSize: 12, color: P.muted, lineHeight: 17,
  },
  sourceRight: {
    alignItems: 'flex-end', gap: 4, flexShrink: 0,
  },
  sourceDate: {
    fontSize: 11, color: P.muted, fontWeight: '500',
  },

  // Disclaimer
  disclaimer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    backgroundColor: P.warningBg,
    borderWidth: 1, borderColor: P.warningLine,
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
  },
  disclaimerText: {
    flex: 1, fontSize: 13,
    lineHeight: 19, color: P.warning,
  },

  // Action bar
  actionBar: {
    flexDirection: 'row',
    gap: 10,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: P.line,
    backgroundColor: P.bg,
  },
  btnSecondary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: P.surface,
    borderWidth: 1,
    borderColor: P.line,
    borderRadius: 14,
    paddingVertical: 15,
  },
  btnSecondaryText: {
    fontSize: 14,
    fontWeight: '600',
    color: P.text,
  },
  btnPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: P.navyDark,
    borderRadius: 14,
    paddingVertical: 15,
  },
  btnPrimaryText: {
    fontSize: 14,
    fontWeight: '700',
    color: P.white,
  },
});