/**
 * @file homeHelpers.test.ts
 * @description Tests pour les fonctions utilitaires de la page d'accueil.
 */

import { getDayLabel, timeAgo, getVerdictUI, formatRowTimestamp } from '../homeHelpers';
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

  describe('formatRowTimestamp', () => {
    beforeEach(() => {
      jest.useFakeTimers();
      jest.setSystemTime(new Date('2026-05-20T10:00:00Z'));
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('retourne HH:mm pour aujourd\'hui', () => {
      const today = new Date('2026-05-20T08:30:00Z').toISOString();
      // Format depends on the host locale offset, but should at least contain ':'
      expect(formatRowTimestamp(today)).toMatch(/\d{2}:\d{2}/);
      expect(formatRowTimestamp(today)).not.toMatch(/Hier|mai/);
    });

    it("retourne 'Hier HH:mm' pour la veille", () => {
      const yesterday = new Date('2026-05-19T12:00:00Z').toISOString();
      expect(formatRowTimestamp(yesterday)).toMatch(/^Hier \d{2}:\d{2}$/);
    });

    it("retourne 'jour mois' pour la même année", () => {
      const olderSameYear = new Date('2026-04-10T12:00:00Z').toISOString();
      expect(formatRowTimestamp(olderSameYear)).toMatch(/avr|10/i);
      expect(formatRowTimestamp(olderSameYear)).not.toMatch(/2026|Hier/);
    });

    it("retourne 'jour mois année' pour une année différente", () => {
      const lastYear = new Date('2025-08-04T12:00:00Z').toISOString();
      expect(formatRowTimestamp(lastYear)).toMatch(/2025/);
    });

    it('retourne une chaîne vide pour une date invalide', () => {
      expect(formatRowTimestamp('not-a-date')).toBe('');
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
