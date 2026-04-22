// utils/homeHelpers.ts
import { P } from '../constants/colors';

export const getDayLabel = () => {
  const days = ['DIMANCHE','LUNDI','MARDI','MERCREDI','JEUDI','VENDREDI','SAMEDI'];
  const months = ['JANV','FÉVR','MARS','AVR','MAI','JUIN','JUIL','AOÛT','SEPT','OCT','NOV','DÉC'];
  const d = new Date();
  return `— ${days[d.getDay()]} ${d.getDate()} ${months[d.getMonth()]}`;
};

export const timeAgo = (dateStr: string) => {
  const diff = Date.now() - new Date(dateStr).getTime();
  const h = Math.floor(diff / 3600000);
  if (h < 1) return "à l'instant";
  if (h < 24) return `il y a ${h}h`;
  return `il y a ${Math.floor(h / 24)}j`;
};

export const getVerdictUI = (verdict: string) => {
  switch (verdict) {
    case 'VRAI': return { label: 'VÉRIFIÉ · VRAI', color: P.vrai, bg: P.vraiBg, icon: 'checkmark-circle' as any };
    case 'FAUX': return { label: 'FAUX', color: P.faux, bg: P.fauxBg, icon: 'close-circle' as any };
    default:     return { label: 'DOUTEUX', color: P.douteux, bg: P.douteuxBg, icon: 'alert-circle' as any };
  }
};