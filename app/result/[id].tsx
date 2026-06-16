// app/result/[id].tsx
import {
  ActivityIndicator,
  View, Text, StyleSheet, TouchableOpacity,
  ScrollView, SafeAreaView, StatusBar, Share, Linking,
} from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { useEffect, useRef, useState } from 'react';
import { bambaraAPI, factCheckAPI, imageVerificationAPI } from '../../services/api';
import { ResultViewModel, mapImageToResult, mapSubmissionToResult } from '../../utils/apiMappers';

type AnalysisLang = 'fr' | 'bm';

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

export default function ResultScreen() {
  const router = useRouter();
  const { id, kind, bm } = useLocalSearchParams<{ id: string; kind?: string; bm?: string }>();
  const isBambaraJourney = bm === '1';
  const [result, setResult] = useState<ResultViewModel | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [analysisLang, setAnalysisLang] = useState<AnalysisLang>(isBambaraJourney ? 'bm' : 'fr');
  const [analysisBambara, setAnalysisBambara] = useState<string | null>(null);
  const [translatingResult, setTranslatingResult] = useState(false);
  const bambaraAttemptedRef = useRef(false);

  useEffect(() => {
    let cancelled = false;
    const loadResult = async () => {
      if (!id) return;
      setLoading(true);
      setError('');
      try {
        if (kind === 'image') {
          const { data } = await imageVerificationAPI.getHistory();
          const verification = data.find((item) => String(item.id) === String(id));
          if (!verification) throw new Error('Résultat image introuvable.');
          if (cancelled) return;
          setResult(mapImageToResult(verification));
        } else {
          const { data } = await factCheckAPI.getResult(id);
          if (cancelled) return;
          setResult(mapSubmissionToResult(data));
        }
      } catch (err: any) {
        if (cancelled) return;
        setError(err.message || 'Impossible de charger ce rapport.');
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    loadResult();
    return () => {
      cancelled = true;
    };
  }, [id, kind]);

  // Phase C: for Bambara journeys, translate the final French analysis to Bambara
  // once the verdict is loaded and terminal. Gate strictly on a terminal verdict
  // so we never cache the "en cours" placeholder.
  useEffect(() => {
    if (!isBambaraJourney || !result || bambaraAttemptedRef.current) return;
    if (result.statusChip === 'En Analyse') return;
    const french = result.analysis?.trim();
    if (!french) return;

    bambaraAttemptedRef.current = true;
    let cancelled = false;
    setTranslatingResult(true);
    bambaraAPI
      .translate(french, 'fr', 'bm')
      .then(({ data }) => {
        if (cancelled) return;
        const translated = (data?.translated_text ?? '').trim();
        if (translated) {
          setAnalysisBambara(translated);
        } else {
          setAnalysisLang('fr');
        }
      })
      .catch(() => {
        if (!cancelled) setAnalysisLang('fr');
      })
      .finally(() => {
        if (!cancelled) setTranslatingResult(false);
      });

    return () => {
      cancelled = true;
    };
  }, [isBambaraJourney, result]);

  const displayedAnalysis =
    isBambaraJourney && analysisLang === 'bm' && analysisBambara
      ? analysisBambara
      : result?.analysis ?? '';

  // Show the wait state from the moment we know it's a Bambara journey until
  // either translation succeeds or the user/failure flips lang back to French.
  // This avoids briefly flashing French before the translation effect kicks in.
  const showBambaraWait =
    isBambaraJourney && analysisLang === 'bm' && !analysisBambara;

  const RESULT = result;

  const verdictColor =
    RESULT?.verdict === 'VRAI'   ? P.green   :
    RESULT?.verdict === 'FAUX'   ? P.red     :
    P.warning;

  const verdictBg =
    RESULT?.verdict === 'VRAI'   ? '#F0FDF4' :
    RESULT?.verdict === 'FAUX'   ? '#FEF2F2' :
    '#FEFBEB';

  const verdictIcon: keyof typeof Ionicons.glyphMap =
    RESULT?.verdict === 'VRAI'   ? 'shield-checkmark' :
    RESULT?.verdict === 'FAUX'   ? 'warning' :
    'hourglass-outline';

  const handleShare = async () => {
    if (!RESULT) return;
    try {
      await Share.share({
        message: `Check-IA · ${RESULT.statusChip}\n\n"${RESULT.claim}"\n\n${RESULT.statusDescription}`,
      });
    } catch {
      // user dismissed
    }
  };

  const openSource = (url?: string) => {
    if (!url) return;
    Linking.openURL(url).catch(() => {});
  };

  return (
    <SafeAreaView style={s.safe}>
      <StatusBar barStyle="dark-content" backgroundColor={P.bg} />

      {/* ── Header ── */}
      <View style={s.header}>
        <TouchableOpacity
          style={s.circleBtn}
          onPress={() => router.back()}
          testID="back-button"
        >
          <Ionicons name="arrow-back" size={16} color={P.text} />
        </TouchableOpacity>
        <Text style={s.headerMeta}>{RESULT?.date ?? ''}</Text>
        <View style={s.circleBtnSpacer} />
      </View>

      <ScrollView
        style={s.scroll}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {loading && (
          <View style={s.stateBox}>
            <ActivityIndicator color={P.navy} />
            <Text style={s.stateText}>Chargement du rapport…</Text>
          </View>
        )}

        {!!error && !loading && (
          <View style={s.disclaimer}>
            <Ionicons name="warning-outline" size={15} color={P.warning} />
            <Text style={s.disclaimerText}>{error}</Text>
          </View>
        )}

        {!loading && RESULT && (
          <>
        {/* ── Panneau statut (mirroir du web : icône + titre + chip + description) ── */}
        <View
          style={[
            s.statusPanel,
            { borderColor: verdictColor, backgroundColor: verdictBg },
          ]}
        >
          <View style={[s.statusIconCircle, { backgroundColor: verdictColor }]}>
            <Ionicons name={verdictIcon} size={26} color={P.white} />
          </View>
          <Text style={[s.statusTitle, { color: verdictColor }]}>
            {RESULT.statusTitle}
          </Text>
          <View style={[s.statusChip, { backgroundColor: verdictColor }]}>
            <Text style={s.statusChipText}>{RESULT.statusChip}</Text>
          </View>
          <Text style={s.statusDescription}>{RESULT.statusDescription}</Text>
        </View>

        {/* ── Barre de confiance (uniquement quand le backend fournit un score réel) ── */}
        {RESULT.hasConfidence && RESULT.score !== undefined && (
          <View style={s.scoreSection}>
            <View style={s.scoreRow}>
              <Text style={s.scoreLabelText}>INDICE DE CONFIANCE</Text>
              <Text style={[s.scoreLevel, { color: verdictColor }]}>
                {RESULT.scoreLabel}
              </Text>
            </View>
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
        )}

        {/* ── L'affirmation vérifiée ── */}
        <Text style={s.sectionLabel}>— L'AFFIRMATION VÉRIFIÉE</Text>

        {/* Card avec bordure gauche verte + ombre + fond crème-vert */}
        <View style={s.claimCard}>
          <View style={[s.claimBorderLeft, { backgroundColor: verdictColor }]} />
          <Text style={s.claimText}>{RESULT.claim}</Text>
        </View>

        {/* ── L'analyse ── */}
        <View style={s.analyseHeaderRow}>
          <Text style={s.sectionLabel}>— L'ANALYSE</Text>
          {isBambaraJourney && (analysisBambara || translatingResult) && (
            <View style={s.langToggle} testID="result-lang-toggle">
              <TouchableOpacity
                style={[s.langToggleBtn, analysisLang === 'fr' && s.langToggleBtnActive]}
                onPress={() => setAnalysisLang('fr')}
                activeOpacity={0.85}
                testID="toggle-fr"
              >
                <Text style={[s.langToggleText, analysisLang === 'fr' && s.langToggleTextActive]}>FR</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[s.langToggleBtn, analysisLang === 'bm' && s.langToggleBtnActive]}
                onPress={() => setAnalysisLang('bm')}
                activeOpacity={0.85}
                disabled={!analysisBambara}
                testID="toggle-bm"
              >
                <Text style={[s.langToggleText, analysisLang === 'bm' && s.langToggleTextActive, !analysisBambara && s.langToggleTextMuted]}>BM</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>

        {showBambaraWait ? (
          <View style={s.bambaraWait} testID="bambara-wait">
            <ActivityIndicator color={P.navy} />
            <Text style={s.bambaraWaitText}>
              Traduction du résultat en bambara…
            </Text>
            <TouchableOpacity
              style={s.bambaraEscape}
              onPress={() => setAnalysisLang('fr')}
              activeOpacity={0.85}
            >
              <Text style={s.bambaraEscapeText}>Voir en français</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <Text style={s.analyseText}>
            {displayedAnalysis}
          </Text>
        )}

        {/* ── Sources croisées ── */}
        <Text style={s.sectionLabel} testID="sources-title">
          — SOURCES CROISÉES · {RESULT.sources.length}
        </Text>
        <View style={s.sourcesList}>
          {RESULT.sources.length === 0 ? (
            <Text style={s.sourceDesc}>Aucune source externe disponible pour ce rapport.</Text>
          ) : RESULT.sources.map((src, i) => (
            <View key={`${src.name}-${i}`}>
              <TouchableOpacity
                style={s.sourceRow}
                activeOpacity={0.75}
                onPress={() => openSource(src.url)}
                disabled={!src.url}
              >
                <View style={[s.sourceCheck, { backgroundColor: P.greenLight }]}>
                  <Ionicons name="checkmark" size={13} color={verdictColor} />
                </View>

                <View style={s.sourceText}>
                  <Text style={[s.sourceName, { color: verdictColor }]}>
                    {src.name}
                  </Text>
                  <Text style={s.sourceDesc} numberOfLines={2}>
                    {src.desc}
                  </Text>
                </View>

                <View style={s.sourceRight}>
                  <Text style={s.sourceDate}>{src.date}</Text>
                  {src.url ? (
                    <Ionicons name="open-outline" size={13} color={P.muted} />
                  ) : null}
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
          </>
        )}
      </ScrollView>

      {/* ── Barre d'actions fixe en bas ── */}
      {RESULT && (
        <View style={s.actionBar}>
          <TouchableOpacity
            style={s.btnPrimary}
            activeOpacity={0.85}
            onPress={handleShare}
          >
            <Ionicons name="share-outline" size={16} color={P.white} />
            <Text style={s.btnPrimaryText}>Partager le rapport</Text>
          </TouchableOpacity>
        </View>
      )}
    </SafeAreaView>
  );
}

// ── Styles ───────────────────────────────────────
const s = StyleSheet.create({
  safe:    { flex: 1, backgroundColor: P.bg },
  scroll:  { flex: 1 },
  content: { paddingHorizontal: 22, paddingTop: 20, paddingBottom: 24 },
  stateBox: {
    minHeight: 180,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
  },
  stateText: {
    fontSize: 13,
    color: P.muted,
    fontWeight: '600',
  },

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
  circleBtnSpacer: {
    width: 34, height: 34,
  },
  headerMeta: {
    fontSize: 11, fontWeight: '600',
    letterSpacing: 0.8, color: P.muted,
  },

  // Status panel (mirror web SubmitFact / AIImageDetection)
  statusPanel: {
    borderWidth: 2,
    borderRadius: 14,
    paddingHorizontal: 20,
    paddingVertical: 22,
    alignItems: 'center',
    marginTop: 8,
    marginBottom: 24,
  },
  statusIconCircle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  statusTitle: {
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 10,
    textAlign: 'center',
    letterSpacing: -0.2,
  },
  statusChip: {
    paddingHorizontal: 14,
    paddingVertical: 5,
    borderRadius: 999,
    marginBottom: 14,
  },
  statusChipText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.4,
  },
  statusDescription: {
    fontSize: 13,
    lineHeight: 19,
    color: P.text,
    textAlign: 'center',
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
  analyseHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  langToggle: {
    flexDirection: 'row',
    backgroundColor: P.surfaceAlt,
    borderRadius: 999,
    padding: 3,
    marginBottom: 8,
  },
  langToggleBtn: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 999,
  },
  langToggleBtnActive: {
    backgroundColor: P.white,
  },
  langToggleText: {
    fontSize: 11,
    fontWeight: '700',
    color: P.muted,
    letterSpacing: 0.6,
  },
  langToggleTextActive: {
    color: P.navy,
  },
  langToggleTextMuted: {
    opacity: 0.5,
  },
  bambaraWait: {
    backgroundColor: P.surface,
    borderWidth: 1,
    borderColor: P.line,
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    gap: 10,
    marginBottom: 28,
  },
  bambaraWaitText: {
    fontSize: 13,
    color: P.text,
    fontWeight: '600',
    textAlign: 'center',
  },
  bambaraEscape: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    backgroundColor: P.surfaceAlt,
    marginTop: 4,
  },
  bambaraEscapeText: {
    fontSize: 12,
    fontWeight: '600',
    color: P.navy,
  },
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
