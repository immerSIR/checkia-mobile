/**
 * @file constants.test.ts
 * @description Tests d'intégrité pour les constantes du projet.
 */

import { Colors, P } from '../colors';
import { TABS, ANALYSIS_STEPS, STEP_TITLES, SOURCES } from '../verify';

describe('Constants Integrity', () => {
  describe('Colors', () => {
    it('doit contenir les couleurs de base', () => {
      expect(Colors.bg).toBeDefined();
      expect(Colors.accent).toBeDefined();
      expect(Colors.true).toBe('#1B6B3C');
      expect(Colors.false).toBe('#B91C1C');
    });

    it('doit avoir le nouveau système P (Palette)', () => {
      expect(P.navy).toBe('#1E3A8A');
      expect(P.vrai).toBe('#1B6B3C');
      expect(P.faux).toBe('#B91C1C');
      expect(P.douteux).toBe('#B8860B');
    });
  });

  describe('Verify Constants', () => {
    it('TABS doit contenir 2 onglets (Texte, Image) — alignement web', () => {
      expect(TABS).toHaveLength(2);
      expect(TABS.map(t => t.key)).toEqual(['Texte', 'Image']);
    });

    it('ANALYSIS_STEPS doit avoir 5 étapes', () => {
      expect(ANALYSIS_STEPS).toHaveLength(5);
      expect(ANALYSIS_STEPS[0].label).toBe('Extraction du texte');
    });

    it('STEP_TITLES doit correspondre aux 5 étapes', () => {
      expect(STEP_TITLES).toHaveLength(5);
      expect(STEP_TITLES[0].etape).toBe('ÉTAPE 1 SUR 5');
    });

    it('SOURCES doit contenir les sites de fact-checking', () => {
      expect(SOURCES).toContain('benbere.com');
      expect(SOURCES).toContain('AFP Fact Check');
    });

  });
});
