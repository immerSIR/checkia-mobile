export const CHIPS = ['Tous', 'Médias', 'Images', 'IA', 'Données', 'Sources'];

export const CATS = [
  { icon: 'newspaper-outline' as const, lb: 'Médias', count: 12 },
  { icon: 'image-outline' as const, lb: 'Images', count: 8 },
  { icon: 'sparkles-outline' as const, lb: 'IA', count: 6 },
  { icon: 'bar-chart-outline' as const, lb: 'Data', count: 4 },
];

export const ARTICLES = [
  { slug: 'deepfake', num: '02', cat: 'IA', dur: '4 min', title: 'Reconnaître un deepfake' },
  { slug: 'source', num: '03', cat: 'SOURCES', dur: '3 min', title: 'Vérifier une source en 3 étapes' },
  { slug: 'biais', num: '04', cat: 'MÉDIAS', dur: '6 min', title: 'Les biais cognitifs à connaître' },
];