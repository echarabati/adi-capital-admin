/**
 * Reversal Calculation Unit Tests
 *
 * Tests for the reversal calculation logic per CALC-004 scenarios.
 *
 * @see CALC-004
 * @see BR-024
 */

import { describe, it, expect } from 'vitest';
import {
  calcularReversal,
  requiresReversal,
  getReversalDescription,
} from '@/lib/calculations/reversal-calculator';

describe('Reversal Calculation', () => {
  describe('calcularReversal', () => {
    describe('Scenario: Cancelar APO revierte capital', () => {
      it('should subtract APO amount from capitalAportado', () => {
        // From issue: APO $30k → cancel should subtract $30k
        const result = calcularReversal('APO', 30000);

        expect(result.capitalAportadoDelta).toBe(-30000);
        expect(result.prefPagadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(true);
      });

      it('should handle APO-D the same as APO', () => {
        const result = calcularReversal('APO-D', 25000);

        expect(result.capitalAportadoDelta).toBe(-25000);
        expect(result.afectsInversion).toBe(true);
      });
    });

    describe('Scenario: Cancelar DEV restaura capital', () => {
      it('should add DEV amount back to capitalAportado', () => {
        // DEV subtracts capital, so cancel should add back
        const result = calcularReversal('DEV', 50000);

        expect(result.capitalAportadoDelta).toBe(50000);
        expect(result.prefPagadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(true);
      });
    });

    describe('Scenario: Cancelar DIS revierte saldos', () => {
      it('should subtract DIS a_pref from prefPagado', () => {
        // From issue: DIS $20k to pref → cancel should subtract
        const result = calcularReversal('DIS', 20000, 'a_pref');

        expect(result.capitalAportadoDelta).toBe(0);
        expect(result.prefPagadoDelta).toBe(-20000);
        expect(result.afectsInversion).toBe(true);
      });

      it('should add DIS a_capital back to capitalAportado', () => {
        // DIS a_capital subtracts from capital, cancel adds back
        const result = calcularReversal('DIS', 70000, 'a_capital');

        expect(result.capitalAportadoDelta).toBe(70000);
        expect(result.prefPagadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(true);
      });

      it('should have no effect for DIS a_utilidad', () => {
        // Utility distributions don't affect cached fields
        const result = calcularReversal('DIS', 30000, 'a_utilidad');

        expect(result.capitalAportadoDelta).toBe(0);
        expect(result.prefPagadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(false);
      });

      it('should have no effect for DIS without destino', () => {
        const result = calcularReversal('DIS', 20000);

        expect(result.afectsInversion).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should return no effect for zero monto', () => {
        const result = calcularReversal('APO', 0);

        expect(result.capitalAportadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(false);
      });

      it('should return no effect for negative monto', () => {
        const result = calcularReversal('APO', -1000);

        expect(result.capitalAportadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(false);
      });

      it('should return no effect for FEE', () => {
        const result = calcularReversal('FEE', 5000);

        expect(result.capitalAportadoDelta).toBe(0);
        expect(result.prefPagadoDelta).toBe(0);
        expect(result.afectsInversion).toBe(false);
      });

      it('should return no effect for unknown concepto', () => {
        const result = calcularReversal('UNKNOWN', 10000);

        expect(result.afectsInversion).toBe(false);
      });
    });
  });

  describe('requiresReversal', () => {
    it('should return true for APO, APO-D, DEV, DIS', () => {
      expect(requiresReversal('APO')).toBe(true);
      expect(requiresReversal('APO-D')).toBe(true);
      expect(requiresReversal('DEV')).toBe(true);
      expect(requiresReversal('DIS')).toBe(true);
    });

    it('should return false for FEE and other conceptos', () => {
      expect(requiresReversal('FEE')).toBe(false);
      expect(requiresReversal('GASTOS')).toBe(false);
    });
  });

  describe('getReversalDescription', () => {
    it('should describe APO reversal', () => {
      const desc = getReversalDescription('APO', 30000);
      expect(desc).toContain('Restar');
      expect(desc).toContain('capital aportado');
    });

    it('should describe DEV reversal', () => {
      const desc = getReversalDescription('DEV', 50000);
      expect(desc).toContain('Sumar');
      expect(desc).toContain('capital aportado');
    });

    it('should describe DIS a_pref reversal', () => {
      const desc = getReversalDescription('DIS', 20000, 'a_pref');
      expect(desc).toContain('pref pagado');
    });
  });
});
