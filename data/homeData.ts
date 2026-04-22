export type Verdict = 'VRAI' | 'FAUX' | 'DOUTEUX';

export interface FactCheck {
  id: string;
  raw_input: string;
  verdict: Verdict;
  created_at: string;
  input_type: string;
  score?: number;
  source?: string
}

export const MOCK_HISTORY: FactCheck[] = [
  {
    id: '1',
    raw_input: 'Le gouvernement malien annonce la gratuité de l\'eau pour tous les ménages ruraux.',
    verdict: 'FAUX',
    created_at: new Date(Date.now() - 2 * 3600000).toISOString(),
    input_type: 'texte',
    score: 12,
    source: 'facebook.com',
  },
  {
    id: '2',
    raw_input: 'https://benbere.com/mali-record-production-coton-2024',
    verdict: 'VRAI',
    created_at: new Date(Date.now() - 5 * 3600000).toISOString(),
    input_type: 'url',
    score: 91,
    source: 'benbere.com',
  },
  {
    id: '3',
    raw_input: 'La photo montre des soldats français au Mali en 2024.',
    verdict: 'DOUTEUX',
    created_at: new Date(Date.now() - 24 * 3600000).toISOString(),
    input_type: 'image',
    score: 47,
    source: 'tiktok.com',
  },
  {
    id: '4',
    raw_input: 'L\'OMS confirme une épidémie de mpox dans 3 pays du Sahel.',
    verdict: 'VRAI',
    created_at: new Date(Date.now() - 30 * 3600000).toISOString(),
    input_type: 'texte',
    score: 88,
    source: 'rfi.fr',
  },
  {
    id: '5',
    raw_input: 'https://x.com/fake-video-bamako-protest',
    verdict: 'FAUX',
    created_at: new Date(Date.now() - 48 * 3600000).toISOString(),
    input_type: 'url',
    score: 8,
    source: 'x.com',
  },
];

export const MOCK_STATS = { vrai: 18, suivi: 24, faux: 6 };