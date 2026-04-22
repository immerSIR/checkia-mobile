import { Ionicons } from '@expo/vector-icons';

export type Tab = 'Texte' | 'URL' | 'Image' | 'Audio';
export type ImageMode = 'ia' | 'identite' | null;
export type AudioMode = 'transcription' | 'voix-ia' | 'fact-check';

export type VerifyTabItem = {
  key: Tab;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export const TABS: VerifyTabItem[] = [
  { key: 'Texte', icon: 'reorder-three-outline', label: 'Texte' },
  { key: 'URL', icon: 'link-outline', label: 'URL' },
  { key: 'Image', icon: 'image-outline', label: 'Image' },
  { key: 'Audio', icon: 'mic-outline', label: 'Audio' },
];

export const ANALYSIS_STEPS = [
  { label: 'Extraction du texte', sub: null },
  { label: 'Détection de la langue', sub: 'Français · bambara' },
  { label: 'Recoupement sources', sub: '8 / 12', badge: 'en cours' },
  { label: 'Analyse contextuelle IA', sub: null },
  { label: 'Génération du rapport', sub: null },
];

export const STEP_TITLES = [
  {
    etape: 'ÉTAPE 1 SUR 5',
    titre: 'Extraction du',
    titreItalic: 'texte.',
    desc: "Nous extrayons et préparons le contenu pour l'analyse.",
  },
  {
    etape: 'ÉTAPE 2 SUR 5',
    titre: 'Détection de la',
    titreItalic: 'langue.',
    desc: "Identification de la langue et du dialecte pour adapter l'analyse.",
  },
  {
    etape: 'ÉTAPE 3 SUR 5',
    titre: 'Recoupement avec les',
    titreItalic: 'sources.',
    desc: 'Nous comparons votre information à 12 sources de fact-checking du Sahel.',
  },
  {
    etape: 'ÉTAPE 4 SUR 5',
    titre: 'Analyse contextuelle',
    titreItalic: 'IA.',
    desc: "L'intelligence artificielle analyse le contexte et les affirmations.",
  },
  {
    etape: 'ÉTAPE 5 SUR 5',
    titre: 'Génération du',
    titreItalic: 'rapport.',
    desc: 'Compilation des résultats et rédaction du rapport final.',
  },
];

export const SOURCES = [
  'benbere.com',
  'maliweb.net',
  'AFP Fact Check',
  'WikAfrica',
  'ActuMali',
];

export const AUDIO_OPTIONS = [
  {
    key: 'transcription' as AudioMode,
    icon: 'reorder-three-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Transcription',
    sub: "Convertit l'audio en texte vérifiable",
  },
  {
    key: 'voix-ia' as AudioMode,
    icon: 'settings-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Voix IA ?',
    sub: 'Détecte si la voix est synthétisée',
  },
  {
    key: 'fact-check' as AudioMode,
    icon: 'chatbubble-ellipses-outline' as keyof typeof Ionicons.glyphMap,
    label: 'Fact-check audio',
    sub: "Analyse les affirmations dans l'audio",
  },
];