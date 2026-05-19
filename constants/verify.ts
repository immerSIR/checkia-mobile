import { Ionicons } from '@expo/vector-icons';

export type Tab = 'Texte' | 'Image';
export type ImageMode = 'ia' | 'content' | null;

export type VerifyTabItem = {
  key: Tab;
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
};

export const TABS: VerifyTabItem[] = [
  { key: 'Texte', icon: 'reorder-three-outline', label: 'Texte' },
  { key: 'Image', icon: 'image-outline', label: 'Image' },
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

