import { FactCheck, Verdict } from '../data/homeData';
import { ImageVerification, Submission } from '../services/api';

export type ResultViewModel = {
  id: string;
  rapportNum: string;
  date: string;
  verdict: Verdict;
  score: number;
  scoreLabel: string;
  claim: string;
  analysis: string;
  sources: Array<{
    name: string;
    date?: string;
    desc: string;
    url?: string;
  }>;
};

const toDate = (value?: string | null) => {
  if (!value) return new Date();
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? new Date() : date;
};

export const formatReportDate = (value?: string | null) =>
  toDate(value).toLocaleDateString('fr-FR', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).replace('.', '').toUpperCase();

export const mapSubmissionStatusToVerdict = (status?: string): Verdict => {
  if (status === 'vérifié') return 'VRAI';
  if (status === 'rejeté') return 'FAUX';
  return 'DOUTEUX';
};

export const mapImageStatusToVerdict = (status?: string): Verdict => {
  if (status === 'VRAIE' || status === 'AUTHENTIQUE') return 'VRAI';
  if (status === 'FAUSSE' || status === 'IA_DÉTECTÉE' || status === 'ERREUR') return 'FAUX';
  return 'DOUTEUX';
};

export const scoreFromSubmission = (submission: Submission) => {
  if (submission.statut === 'vérifié') return 87;
  if (submission.statut === 'rejeté') return 32;
  return 50;
};

export const scoreLabel = (score: number) => {
  if (score >= 75) return 'ÉLEVÉ';
  if (score >= 45) return 'MOYEN';
  return 'FAIBLE';
};

const sourceName = (source: any) => {
  if (source?.title) return source.title;
  if (source?.name) return source.name;
  if (source?.url) {
    try {
      return new URL(source.url).hostname;
    } catch {
      return source.url;
    }
  }
  return String(source ?? 'Source');
};

export const mapSubmissionToFactCheck = (submission: Submission): FactCheck => ({
  id: String(submission.id),
  raw_input: submission.texte,
  verdict: mapSubmissionStatusToVerdict(submission.statut),
  created_at: submission.date,
  input_type: submission.source ? 'url' : 'texte',
  score: scoreFromSubmission(submission),
  source: submission.source || undefined,
});

export const mapImageToFactCheck = (verification: ImageVerification): FactCheck => ({
  id: `image-${verification.id}`,
  raw_input: verification.claim_text || verification.original_filename || 'Image importée',
  verdict: mapImageStatusToVerdict(verification.status),
  created_at: verification.date,
  input_type: 'image',
  score: verification.confidence ?? 0,
  source: verification.verification_type === 'ai_detection' ? 'Détection IA' : 'Vérification image',
});

export const mapSubmissionToResult = (submission: Submission): ResultViewModel => {
  const score = scoreFromSubmission(submission);
  const sources = (submission.web_sources ?? []).map((source: any) => ({
    name: sourceName(source),
    desc: source?.snippet || source?.description || source?.content || source?.url || 'Source utilisée pour la vérification.',
    url: source?.url,
  }));

  return {
    id: String(submission.id),
    rapportNum: String(submission.id).padStart(3, '0'),
    date: formatReportDate(submission.date),
    verdict: mapSubmissionStatusToVerdict(submission.statut),
    score,
    scoreLabel: scoreLabel(score),
    claim: submission.texte,
    analysis: submission.detailed_result || "L'analyse est en cours de finalisation.",
    sources,
  };
};

export const mapImageToResult = (verification: ImageVerification): ResultViewModel => {
  const score = verification.confidence ?? 0;

  return {
    id: `image-${verification.id}`,
    rapportNum: String(verification.id).padStart(3, '0'),
    date: formatReportDate(verification.date),
    verdict: mapImageStatusToVerdict(verification.status),
    score,
    scoreLabel: scoreLabel(score),
    claim: verification.claim_text || verification.original_filename || 'Image importée',
    analysis: verification.explanation || "L'analyse image est terminée.",
    sources: verification.image_url
      ? [{ name: verification.original_filename || 'Image', desc: verification.image_url, url: verification.image_url }]
      : [],
  };
};
