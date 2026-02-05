/**
 * Pref Calculation Unit Tests
 *
 * Tests for the daily Pref calculation logic.
 * Formula: pref_diario = (capital_aportado × tasa_pref / 100) / 365
 *
 * @see CALC-001
 * @see BR-030
 */

import { describe, it, expect } from 'vitest';

/**
 * Calculate daily Pref amount.
 * Replicated from cron route for isolated unit testing.
 */
function calculatePrefDiario(capitalAportado: number, tasaPref: number): number {
  if (capitalAportado <= 0 || tasaPref <= 0) {
    return 0;
  }
  return (capitalAportado * tasaPref) / 100 / 365;
}

/**
 * Calculate new accumulated Pref.
 */
function calculateNewPrefAcumulado(
  currentPref: number,
  capitalAportado: number,
  tasaPref: number
): number {
  const prefDiario = calculatePrefDiario(capitalAportado, tasaPref);
  return currentPref + prefDiario;
}

describe('Pref Calculation Logic', () => {
  describe('calculatePrefDiario', () => {
    it('should calculate correct daily Pref for standard values', () => {
      // $100,000 capital at 12% annual rate
      // Expected: (100000 * 12 / 100) / 365 = 32.876712...
      const result = calculatePrefDiario(100000, 12);
      expect(result).toBeCloseTo(32.876712, 4);
    });

    it('should return 0 when capital is 0', () => {
      expect(calculatePrefDiario(0, 12)).toBe(0);
    });

    it('should return 0 when capital is negative', () => {
      expect(calculatePrefDiario(-50000, 12)).toBe(0);
    });

    it('should return 0 when tasa_pref is 0', () => {
      expect(calculatePrefDiario(100000, 0)).toBe(0);
    });

    it('should return 0 when tasa_pref is negative', () => {
      expect(calculatePrefDiario(100000, -5)).toBe(0);
    });

    it('should handle small capital amounts', () => {
      // $1,000 at 10%
      // Expected: (1000 * 10 / 100) / 365 = 0.273972...
      const result = calculatePrefDiario(1000, 10);
      expect(result).toBeCloseTo(0.273972, 4);
    });

    it('should handle high pref rates', () => {
      // $50,000 at 20%
      // Expected: (50000 * 20 / 100) / 365 = 27.397260...
      const result = calculatePrefDiario(50000, 20);
      expect(result).toBeCloseTo(27.39726, 4);
    });

    it('should handle fractional rates', () => {
      // $100,000 at 8.5%
      // Expected: (100000 * 8.5 / 100) / 365 = 23.287671...
      const result = calculatePrefDiario(100000, 8.5);
      expect(result).toBeCloseTo(23.287671, 4);
    });
  });

  describe('calculateNewPrefAcumulado', () => {
    it('should add daily Pref to accumulated amount', () => {
      const currentPref = 1000;
      const capital = 100000;
      const tasa = 12;

      const result = calculateNewPrefAcumulado(currentPref, capital, tasa);
      const expectedDailyPref = (100000 * 12) / 100 / 365;

      expect(result).toBeCloseTo(currentPref + expectedDailyPref, 4);
    });

    it('should handle zero current Pref', () => {
      const result = calculateNewPrefAcumulado(0, 100000, 12);
      expect(result).toBeCloseTo(32.876712, 4);
    });

    it('should not change Pref when capital is zero', () => {
      const currentPref = 500;
      const result = calculateNewPrefAcumulado(currentPref, 0, 12);
      expect(result).toBe(currentPref);
    });

    it('should not change Pref when tasa is zero', () => {
      const currentPref = 500;
      const result = calculateNewPrefAcumulado(currentPref, 100000, 0);
      expect(result).toBe(currentPref);
    });
  });

  describe('Annual Pref Calculation', () => {
    it('should accumulate to expected annual amount over 365 days', () => {
      const capital = 100000;
      const tasa = 12;
      let accumulated = 0;

      // Simulate 365 days of accumulation
      for (let day = 0; day < 365; day++) {
        accumulated = calculateNewPrefAcumulado(accumulated, capital, tasa);
      }

      // Expected annual: capital * tasa / 100 = 12,000
      expect(accumulated).toBeCloseTo(12000, 0);
    });

    it('should handle leap year approximation', () => {
      // Our formula uses 365, so 366 days will slightly exceed annual rate
      const capital = 100000;
      const tasa = 12;
      let accumulated = 0;

      for (let day = 0; day < 366; day++) {
        accumulated = calculateNewPrefAcumulado(accumulated, capital, tasa);
      }

      // Slightly more than 12,000 due to extra day
      expect(accumulated).toBeGreaterThan(12000);
      expect(accumulated).toBeLessThan(12100);
    });
  });
});
