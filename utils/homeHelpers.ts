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

const isSameCalendarDay = (a: Date, b: Date) =>
  a.getFullYear() === b.getFullYear() &&
  a.getMonth() === b.getMonth() &&
  a.getDate() === b.getDate();

// Smart timestamp for list rows: HH:mm today, "Hier HH:mm" yesterday,
// "20 mai" same year, "20 mai 2025" otherwise.
export const formatRowTimestamp = (dateStr: string) => {
  const date = new Date(dateStr);
  if (Number.isNaN(date.getTime())) return '';
  const now = new Date();

  const hhmm = date.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' });

  if (isSameCalendarDay(date, now)) return hhmm;

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameCalendarDay(date, yesterday)) return `Hier ${hhmm}`;

  if (date.getFullYear() === now.getFullYear()) {
    return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' });
  }

  return date.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short', year: 'numeric' });
};

export const getVerdictUI = (verdict: string) => {
  switch (verdict) {
    case 'VRAI': return { label: 'VÉRIFIÉ · VRAI', color: P.vrai, bg: P.vraiBg, icon: 'checkmark-circle' as any };
    case 'FAUX': return { label: 'FAUX', color: P.faux, bg: P.fauxBg, icon: 'close' as any };
    default:     return { label: 'DOUTEUX', color: P.douteux, bg: P.douteuxBg, icon: 'alert' as any };
  }
};
