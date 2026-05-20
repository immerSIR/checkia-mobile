export type Verdict = 'VRAI' | 'FAUX' | 'DOUTEUX';

export interface FactCheck {
  id: string;
  raw_input: string;
  verdict: Verdict;
  created_at: string;
  input_type: string;
  score?: number;
  source?: string;
}
