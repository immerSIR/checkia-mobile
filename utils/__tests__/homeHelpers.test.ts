/**
 * @file homeHelpers.test.ts
 * @description Tests pour les fonctions utilitaires de la page d'accueil.
 */

import { getDayLabel, timeAgo, getVerdictUI } from '../homeHelpers';
import { P } from '../../constants/colors';

describe('homeHelpers Utils', () => {
  describe('getDayLabel', () => {
    it('doit retourner une chaîne formatée (— JOUR DATE MOIS)', () => {
      const label = getDayLabel();
      expect(label).toMatch(/^— [A-ZÉ]+ \d+ [A-ZÉ]+$/);
    });
  });

  describe('timeAgo', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2024-01-01T12:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retourne "à l\'instant" pour moins d\'une heure', () => {
      const thirtyMinsAgo = new Date('2024-01-01T11:30:00Z').toISOString();
      expect(timeAgo(thirtyMinsAgo)).toBe("à l'instant");
    });

    it('retourne les heures pour moins de 24h', () => {
      const fiveHoursAgo = new Date('2024-01-01T07:00:00Z').toISOString();
      expect(timeAgo(fiveHoursAgo)).toBe("il y a 5h");
    });

    it('retourne les jours pour plus de 24h', () => {
      const twoDaysAgo = new Date('2023-12-30T12:00:00Z').toISOString();
      expect(timeAgo(twoDaysAgo)).toBe("il y a 2j");
    });
  });

  describe('getVerdictUI', () => {
    it('retourne les bonnes couleurs et labels pour VRAI', () => {
      const ui = getVerdictUI('VRAI');
      expect(ui.label).toBe('VÉRIFIÉ · VRAI');
      expect(ui.color).toBe(P.vrai);
      expect(ui.icon).toBe('checkmark-circle');
    });

    it('retourne les bonnes couleurs et labels pour FAUX', () => {
      const ui = getVerdictUI('FAUX');
      expect(ui.label).toBe('FAUX');
      expect(ui.color).toBe(P.faux);
    });

    it('retourne DOUTEUX par défaut', () => {
      const ui = getVerdictUI('AUTRE');
      expect(ui.label).toBe('DOUTEUX');
      expect(ui.color).toBe(P.douteux);
    });
  });
});
