import { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity,
  TextInput, ScrollView, Modal, ActivityIndicator, Image
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';
import { Colors } from '../../constants/colors';
import { urlPreviewAPI } from '../../services/api';

type Tab = 'Texte' | 'URL' | 'Image' | 'Son';
type ImageAnalysis = 'ia' | 'contenu' | null;
type SonAnalysis  = 'transcription' | 'voix-ia' | 'fact-check';

const STEPS = [
  'Extraction du contenu',
  'Recherche base Sahel',
  'Analyse IA NLP',
  'Génération rapport',
];

export default function Verify() {
  const router = useRouter();

  // ── états globaux
  const [tab, setTab]         = useState<Tab>('Texte');
  const [loading, setLoading] = useState(false);
  const [step, setStep]       = useState(0);

  // ── états par tab
  const [texte, setTexte]               = useState('');
  const [url, setUrl]                   = useState('');
  const [imageUri, setImageUri]         = useState<string | null>(null);
  const [imageAnalysis, setImageAnalysis] = useState<ImageAnalysis>(null);
  const [sonUri, setSonUri]             = useState<string | null>(null);
  const [sonAnalysis, setSonAnalysis]   = useState<SonAnalysis>('transcription');
  const [langue, setLangue]             = useState('Français');
  const [preview, setPreview] = useState<{
    title: string; image: string; desc: string; source: string;
  } | null>(null);
  const [previewLoading, setPreviewLoading] = useState(false);
  // Dans le TextInput URL — ajoute onChangeText avec debounce
const [urlTimer, setUrlTimer] = useState<any>(null);

  // ── validation selon tab actif
  const canAnalyze = () => {
    if (tab === 'Texte') return texte.trim().length > 0;
    if (tab === 'URL')   return url.trim().length > 0;
    if (tab === 'Image') return imageUri !== null && imageAnalysis !== null;
    if (tab === 'Son')   return sonUri !== null;
    return false;
  };

  const fetchPreview = async (value: string) => {
    if (!value.startsWith('http')) return;
    setPreviewLoading(true);
    try {
      const { data } = await urlPreviewAPI.fetch(value);
      setPreview(data);
    } catch {
      setPreview(null); // affiche "Aperçu non disponible"
    } finally {
      setPreviewLoading(false);
    }
  };
  

  // ── lancer l'analyse
  const handleAnalyze = () => {
    if (!canAnalyze()) return;
    setLoading(true);
    setStep(0);
    let current = 0;
    const interval = setInterval(() => {
      current++;
      setStep(current);
      if (current >= STEPS.length) {
        clearInterval(interval);
        setLoading(false);
        router.push('/result/1');
      }
    }, 850);
  };

  const handleUrlChange = (value: string) => {
    setUrl(value);
    setPreview(null);
    if (urlTimer) clearTimeout(urlTimer);
    setUrlTimer(setTimeout(() => fetchPreview(value), 800));
  };



  // ── sélecteur image
  const pickImage = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      allowsEditing: true,
      quality: 0.8,
    });
    if (!result.canceled) setImageUri(result.assets[0].uri);
  };

  return (
    <>
      <ScrollView style={s.screen} contentContainerStyle={s.content}>

        {/* ── Header ── */}
        <Text style={s.title}>Nouvelle vérification</Text>

        {/* ── 4 Tabs ── */}
        <View style={s.tabs}>
          {(['Texte','URL','Image','Son'] as Tab[]).map((t) => (
            <TouchableOpacity
              key={t}
              style={[s.tab, tab === t && s.tabActive]}
              onPress={() => setTab(t)}
            >
              <Text style={[s.tabText, tab === t && s.tabTextActive]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* ════════════════ TAB TEXTE ════════════════ */}
        {tab === 'Texte' && (
          <View>
            <TextInput
              style={s.textarea}
              placeholder="Collez ou tapez ici le texte à vérifier…"
              placeholderTextColor={Colors.gray}
              multiline
              numberOfLines={8}
              value={texte}
              onChangeText={setTexte}
              textAlignVertical="top"
              autoCapitalize="none"
              autoCorrect={false}
            />
            <Text style={s.counter}>{texte.length} / 1000</Text>

            <LangPicker value={langue} onChange={setLangue} />

            <TouchableOpacity
              style={[s.cta, !texte.trim() && s.ctaDisabled]}
              onPress={handleAnalyze}
              disabled={!texte.trim()}
            >
              <Text style={s.ctaText}>🔍  Analyser le texte</Text>
            </TouchableOpacity>

            <View style={s.tip}>
              <Text style={s.tipText}>💡  Collez n'importe quel texte ou article</Text>
            </View>
          </View>
        )}

        {/* ════════════════ TAB URL ════════════════ */}
        {tab === 'URL' && (
          <View>
            {/* CORRECTION : label avec marginBottom généreux */}
            <Text style={s.label}>Lien de l'article à vérifier</Text>
            <View style={s.urlInput}>
              <Text style={s.urlIcon}>🔗</Text>
              <TextInput
                style={s.urlField}
                placeholder="https://  coller votre lien ici…"
                placeholderTextColor={Colors.gray}
                value={url}
                onChangeText={handleUrlChange}
                autoCapitalize="none"
                autoCorrect={false}
                keyboardType="url"
              />
            </View>

            {/* Aperçu */}
            <Text style={[s.label, { marginTop: 18 }]}>Aperçu de l'article</Text>
            <View style={s.previewCard}>
              {previewLoading ? (
                <ActivityIndicator color={Colors.accent} style={{ margin: 30 }} />
              ) : preview ? (
                <>
                  {preview.image ? (
                    <Image source={{ uri: preview.image }} style={{ width: '100%', height: 120 }} resizeMode="cover" />
                  ) : (
                    <View style={s.previewImg}>
                      <Text style={s.previewImgTxt}>🖼  Pas d'image disponible</Text>
                    </View>
                  )}
                  <View style={{ padding: 12 }}>
                    <Text style={s.previewSource}>{preview.source} · maintenant</Text>
                    <Text style={s.previewTitle} numberOfLines={2}>{preview.title || 'Titre non disponible'}</Text>
                    <Text style={s.previewSub}   numberOfLines={3}>{preview.desc  || 'Résumé non disponible'}</Text>
                  </View>
                </>
              ) : url.startsWith('http') && !previewLoading ? (
                // ← URL valide mais scraping échoué (Facebook, Instagram, etc.)
                <View style={[s.previewImg, { paddingVertical: 20 }]}>
                  <Text style={s.previewImgTxt}>⚠️  Aperçu non disponible pour ce site</Text>
                  <Text style={[s.previewImgTxt, { fontSize: 11, marginTop: 6, textAlign: 'center', paddingHorizontal: 16 }]}>
                    Facebook, Instagram... bloquent le scraping.{'\n'}
                    Copiez le texte du post et utilisez l'onglet Texte.
                  </Text>
                </View>
              ) : (
                // ← URL pas encore saisie
                <View style={s.previewImg}>
                  <Text style={s.previewImgTxt}>🖼  Aperçu image · source · résumé</Text>
                </View>
              )}
            </View>

            {/* Sources compatibles */}
            <Text style={[s.label, { marginTop: 18 }]}>Sources compatibles</Text>
            <View style={s.sourcesGrid}>
              {['benbere.com','voixdemopti.com','malijet.com','AFP Fact Check',
                'RFI Afrique','Snopes'].map((src) => (
                <View key={src} style={s.sourceChip}>
                  <Text style={s.sourceChipText}>✓  {src}</Text>
                </View>
              ))}
            </View>

            <LangPicker value={langue} onChange={setLangue} />

            <TouchableOpacity
              style={[s.cta, !url.trim() && s.ctaDisabled]}
              onPress={handleAnalyze}
              disabled={!url.trim()}
            >
              <Text style={s.ctaText}>🔍  Analyser l'URL</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ════════════════ TAB IMAGE ════════════════ */}
        {tab === 'Image' && (
          <View>
            {/* Zone upload */}
            <Text style={s.label}>Importer une image</Text>
            <TouchableOpacity style={s.uploadZone} onPress={pickImage}>
              {imageUri ? (
                <Image source={{ uri: imageUri }} style={s.imagePreview} resizeMode="cover" />
              ) : (
                <>
                  <Text style={s.uploadIcon}>📁</Text>
                  <Text style={s.uploadText}>Appuyez pour choisir</Text>
                  <Text style={s.uploadSub}>JPG · PNG · WEBP · max 10Mo</Text>
                </>
              )}
            </TouchableOpacity>

            {imageUri && (
              <TouchableOpacity onPress={() => setImageUri(null)}>
                <Text style={s.changeImg}>🔄  Changer l'image</Text>
              </TouchableOpacity>
            )}

            {/* 2 volets */}
            <Text style={[s.label, { marginTop: 18 }]}>
              Choisir le type d'analyse IA
            </Text>
            <View style={s.voletsRow}>

              {/* Volet 1 — Générée par IA */}
              <TouchableOpacity
                style={[s.volet, s.voletIA, imageAnalysis === 'ia' && s.voletSelected]}
                onPress={() => setImageAnalysis('ia')}
              >
                <Text style={s.voletIcon}>🤖</Text>
                <Text style={s.voletTitle}>Générée par IA ?</Text>
                <Text style={s.voletSub}>Détecte si l'image{'\n'}est un deepfake/IA</Text>
                {imageAnalysis === 'ia' && (
                  <Text style={[s.voletSelected_label, { color: Colors.accent2 }]}>✓ Sélectionné</Text>
                )}
              </TouchableOpacity>

              {/* Volet 2 — Vérification de contenu (CORRECTION) */}
              <TouchableOpacity
                style={[s.volet, s.voletContenu, imageAnalysis === 'contenu' && s.voletSelected]}
                onPress={() => setImageAnalysis('contenu')}
              >
                <Text style={s.voletIcon}>🔍</Text>
                <Text style={s.voletTitle}>Vérification de{'\n'}contenu</Text>
                <Text style={s.voletSub}>Vérifie si la personne{'\n'}est bien celle qu'on croit</Text>
                {imageAnalysis === 'contenu' && (
                  <Text style={[s.voletSelected_label, { color: Colors.accent }]}>✓ Sélectionné</Text>
                )}
              </TouchableOpacity>
            </View>

            <View style={s.confidentialBanner}>
              <Text style={s.confidentialText}>
                ⚠️  Images analysées localement — confidentielles
              </Text>
            </View>

            <TouchableOpacity
              style={[s.cta, !canAnalyze() && s.ctaDisabled]}
              onPress={handleAnalyze}
              disabled={!canAnalyze()}
            >
              <Text style={s.ctaText}>🔍  Lancer l'analyse image</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ════════════════ TAB SON ════════════════ */}
        {tab === 'Son' && (
          <View>
            <Text style={s.label}>Analyser un fichier audio</Text>

            {/* Upload audio */}
            <TouchableOpacity style={s.uploadZone} onPress={() => {}}>
              {sonUri ? (
                <View style={{ alignItems: 'center' }}>
                  <Text style={{ fontSize: 36 }}>🎵</Text>
                  <Text style={s.uploadText}>Fichier audio chargé ✓</Text>
                </View>
              ) : (
                <>
                  <Text style={s.uploadIcon}>🎵</Text>
                  <Text style={s.uploadText}>Importer un fichier audio</Text>
                  <Text style={s.uploadSub}>MP3 · WAV · M4A · OGG · max 50Mo</Text>
                </>
              )}
            </TouchableOpacity>

            <Text style={s.orDivider}>— ou —</Text>

            {/* Enregistrement direct */}
            <TouchableOpacity style={s.recordBtn}>
              <Text style={s.recordBtnText}>🎙  Enregistrer maintenant</Text>
            </TouchableOpacity>

            {/* Types d'analyse */}
            <Text style={[s.label, { marginTop: 20 }]}>Type d'analyse</Text>
            {[
              { key: 'transcription', icon: '🗣', label: 'Transcription',
                sub: 'Convertit l\'audio en texte vérifiable', color: Colors.accent },
              { key: 'voix-ia', icon: '🤖', label: 'Voix IA ?',
                sub: 'Détecte si la voix est générée par IA', color: Colors.accent2 },
              { key: 'fact-check', icon: '📢', label: 'Fact-check audio',
                sub: 'Analyse les affirmations dans l\'audio', color: Colors.warning },
            ].map((item) => (
              <TouchableOpacity
                key={item.key}
                style={[s.sonOption, { borderColor: sonAnalysis === item.key ? item.color : Colors.border }]}
                onPress={() => setSonAnalysis(item.key as SonAnalysis)}
              >
                <View style={{ flex: 1 }}>
                  <Text style={s.sonOptionTitle}>{item.icon}  {item.label}</Text>
                  <Text style={s.sonOptionSub}>{item.sub}</Text>
                </View>
                <View style={[s.radio, sonAnalysis === item.key && { borderColor: item.color }]}>
                  {sonAnalysis === item.key && (
                    <View style={[s.radioDot, { backgroundColor: item.color }]} />
                  )}
                </View>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[s.cta, { marginTop: 20 }]}
              onPress={handleAnalyze}
            >
              <Text style={s.ctaText}>🔍  Analyser le son</Text>
            </TouchableOpacity>
          </View>
        )}

      </ScrollView>

      {/* ════════════════ MODAL LOADING ════════════════ */}
      <Modal visible={loading} transparent animationType="fade">
        <View style={s.overlay}>
          <View style={s.loadingCard}>
            <View style={s.ring}>
              <ActivityIndicator size="large" color={Colors.accent} />
            </View>
            <Text style={s.loadingTitle}>Analyse en cours…</Text>
            {STEPS.map((st, i) => (
              <Text key={i} style={[s.stepText, {
                color: i < step ? Colors.accent : i === step ? Colors.white : Colors.gray
              }]}>
                {i < step ? '✓  ' : i === step ? '⋯  ' : '○  '}{st}
              </Text>
            ))}
            <View style={s.barTrack}>
              <View style={[s.barFill, {
                width: `${Math.round((step / STEPS.length) * 100)}%` as any
              }]} />
            </View>
            <Text style={s.pct}>{Math.round((step / STEPS.length) * 100)}%</Text>
          </View>
        </View>
      </Modal>
    </>
  );
}

// ── Composant réutilisable LangPicker ──────────────────────────────────────
function LangPicker({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  return (
    <View style={s.langRow}>
      <Text style={s.langLabel}>🌍  Langue :</Text>
      <TouchableOpacity style={s.langPicker}>
        <Text style={s.langValue}>{value}  ▼</Text>
      </TouchableOpacity>
    </View>
  );
}

// ── Styles ─────────────────────────────────────────────────────────────────
const s = StyleSheet.create({
  screen:    { flex: 1, backgroundColor: Colors.bg },
  content:   { padding: 22, paddingTop: 60, paddingBottom: 40 },
  title:     { fontSize: 22, fontWeight: '800', color: Colors.white, marginBottom: 20 },

  // tabs
  tabs:          { flexDirection: 'row', gap: 8, marginBottom: 22 },
  tab:           { flex: 1, paddingVertical: 10, borderRadius: 8, backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, alignItems: 'center' },
  tabActive:     { backgroundColor: Colors.accent, borderColor: Colors.accent },
  tabText:       { color: Colors.gray, fontSize: 12, fontWeight: '600' },
  tabTextActive: { color: Colors.bg, fontWeight: '800' },

  // label
  label: { fontSize: 13, color: Colors.gray, fontWeight: '700', marginBottom: 10 },

  // texte
  textarea: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 12, padding: 16, color: Colors.white, fontSize: 14, minHeight: 160, marginBottom: 8 },
  counter:  { color: Colors.gray, fontSize: 12, textAlign: 'right', marginBottom: 18 },
  tip:      { backgroundColor: 'rgba(0,212,170,0.07)', borderWidth: 1, borderColor: Colors.accent, borderRadius: 8, padding: 12, marginTop: 12 },
  tipText:  { color: Colors.accent, fontSize: 12, textAlign: 'center' },

  // url
  urlInput: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 10, paddingHorizontal: 14, paddingVertical: 14, marginBottom: 4 },
  urlIcon:  { fontSize: 16, marginRight: 8 },
  urlField: { flex: 1, color: Colors.white, fontSize: 13 },

  // url preview
  previewCard:    { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 12, overflow: 'hidden' },
  previewImg:     { height: 80, backgroundColor: Colors.border, alignItems: 'center', justifyContent: 'center' },
  previewImgTxt:  { color: Colors.gray, fontSize: 12 },
  previewSource:  { fontSize: 11, color: Colors.gray, marginBottom: 4 },
  previewTitle:   { fontSize: 13, color: Colors.white, fontWeight: '700', marginBottom: 4 },
  previewSub:     { fontSize: 12, color: Colors.gray },

  // sources
  sourcesGrid:    { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 18 },
  sourceChip:     { backgroundColor: Colors.accentDim, borderWidth: 1, borderColor: Colors.accent, borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  sourceChipText: { color: Colors.accent, fontSize: 11 },

  // langue
  langRow:    { flexDirection: 'row', alignItems: 'center', gap: 12, marginBottom: 20 },
  langLabel:  { color: Colors.gray, fontSize: 13 },
  langPicker: { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 8, paddingVertical: 8, paddingHorizontal: 14 },
  langValue:  { color: Colors.white, fontSize: 13 },

  // upload zone
  uploadZone:   { backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.border2, borderRadius: 12, padding: 30, alignItems: 'center', justifyContent: 'center', minHeight: 120, marginBottom: 8 },
  uploadIcon:   { fontSize: 32, marginBottom: 10 },
  uploadText:   { color: Colors.gray, fontSize: 13, marginBottom: 4 },
  uploadSub:    { color: Colors.border2, fontSize: 11 },
  imagePreview: { width: '100%', height: 180, borderRadius: 10 },
  changeImg:    { color: Colors.accent, fontSize: 12, textAlign: 'center', marginBottom: 8 },

  // volets image
  voletsRow:    { flexDirection: 'row', gap: 10, marginBottom: 14 },
  volet:        { flex: 1, borderWidth: 1, borderRadius: 12, padding: 14, alignItems: 'center' },
  voletIA:      { backgroundColor: 'rgba(99,102,241,0.10)', borderColor: Colors.accent2 },
  voletContenu: { backgroundColor: 'rgba(0,212,170,0.10)', borderColor: Colors.accent },
  voletSelected:{ borderWidth: 2 },
  voletIcon:    { fontSize: 26, marginBottom: 8 },
  voletTitle:   { fontSize: 12, color: Colors.white, fontWeight: '800', textAlign: 'center', marginBottom: 6 },
  voletSub:     { fontSize: 10, color: Colors.gray, textAlign: 'center', lineHeight: 15 },
  voletSelected_label: { fontSize: 10, fontWeight: '800', marginTop: 6 },

  confidentialBanner: { backgroundColor: 'rgba(245,158,11,0.08)', borderWidth: 1, borderColor: Colors.warning, borderRadius: 8, padding: 10, marginBottom: 16 },
  confidentialText:   { color: Colors.warning, fontSize: 11, textAlign: 'center' },

  // son
  orDivider:     { color: Colors.gray, fontSize: 13, textAlign: 'center', marginVertical: 12 },
  recordBtn:     { backgroundColor: 'rgba(239,68,68,0.10)', borderWidth: 1, borderColor: Colors.false, borderRadius: 10, paddingVertical: 14, alignItems: 'center', marginBottom: 4 },
  recordBtnText: { color: Colors.false, fontSize: 14, fontWeight: '700' },
  sonOption:     { backgroundColor: Colors.card, borderWidth: 1, borderRadius: 12, padding: 14, marginBottom: 10, flexDirection: 'row', alignItems: 'center' },
  sonOptionTitle:{ color: Colors.white, fontSize: 13, fontWeight: '700', marginBottom: 4 },
  sonOptionSub:  { color: Colors.gray, fontSize: 11 },
  radio:         { width: 22, height: 22, borderRadius: 11, borderWidth: 2, borderColor: Colors.border2, alignItems: 'center', justifyContent: 'center' },
  radioDot:      { width: 10, height: 10, borderRadius: 5 },

  // cta
  cta:        { borderRadius: 12, paddingVertical: 16, alignItems: 'center', backgroundColor: Colors.accent },
  ctaDisabled:{ opacity: 0.35 },
  ctaText:    { color: Colors.bg, fontSize: 15, fontWeight: '800' },

  // modal loading
  overlay:      { flex: 1, backgroundColor: 'rgba(5,13,26,0.93)', alignItems: 'center', justifyContent: 'center', padding: 28 },
  loadingCard:  { width: '100%', backgroundColor: Colors.card, borderWidth: 1, borderColor: Colors.accent, borderRadius: 20, padding: 28, alignItems: 'center' },
  ring:         { width: 90, height: 90, borderRadius: 45, borderWidth: 2, borderColor: Colors.accent, backgroundColor: Colors.accentDim, alignItems: 'center', justifyContent: 'center', marginBottom: 20 },
  loadingTitle: { fontSize: 18, fontWeight: '800', color: Colors.white, marginBottom: 20 },
  stepText:     { fontSize: 13, marginBottom: 8, alignSelf: 'flex-start' },
  barTrack:     { width: '100%', height: 6, backgroundColor: Colors.border, borderRadius: 3, marginTop: 16 },
  barFill:      { height: 6, backgroundColor: Colors.accent, borderRadius: 3 },
  pct:          { color: Colors.gray, fontSize: 12, marginTop: 8 },
});
