/**
 * Success Fee Calculation Unit Tests
 *
 * Tests for the success fee calculation logic per BR-040/BR-041.
 *
 * @see CALC-002
 */

import { describe, it, expect } from 'vitest';
import {
  calcularSuccessFee,
  calcularSuccessFeeCascada,
  getEffectiveSuccessFeePct,
} from '@/lib/calculations/success-fee';

describe('Success Fee Calculation', () => {
  describe('calcularSuccessFee', () => {
    describe('Scenario: Distribution with positive utility', () => {
      it('should calculate correct fee for $150k on $100k at 20%', () => {
        // From issue: Juan invested $100k, receives $150k distribution
        const result = calcularSuccessFee({
          totalDistribuido: 150000,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(50000);
        expect(result.successFee).toBe(10000);
        expect(result.montoNeto).toBe(140000);
        expect(result.aplicaFee).toBe(true);
      });

      it('should handle smaller profit margins', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 110000,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(10000);
        expect(result.successFee).toBe(2000);
        expect(result.montoNeto).toBe(108000);
        expect(result.aplicaFee).toBe(true);
      });

      it('should handle fractional percentages', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 120000,
          capitalOriginal: 100000,
          successFeePct: 15.5,
        });

        expect(result.utilidad).toBe(20000);
        expect(result.successFee).toBe(3100); // 20000 * 15.5%
        expect(result.montoNeto).toBe(116900);
      });
    });

    describe('Scenario: Distribution without utility (loss)', () => {
      it('should return zero fee when distribution < capital', () => {
        // From issue: Juan invested $100k, receives $80k (loss)
        const result = calcularSuccessFee({
          totalDistribuido: 80000,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(-20000);
        expect(result.successFee).toBe(0);
        expect(result.montoNeto).toBe(80000);
        expect(result.aplicaFee).toBe(false);
      });

      it('should return zero fee when distribution equals capital', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 100000,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(0);
        expect(result.successFee).toBe(0);
        expect(result.montoNeto).toBe(100000);
        expect(result.aplicaFee).toBe(false);
      });

      it('should handle zero distribution', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 0,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(-100000);
        expect(result.successFee).toBe(0);
        expect(result.montoNeto).toBe(0);
        expect(result.aplicaFee).toBe(false);
      });
    });

    describe('Edge cases', () => {
      it('should handle zero success fee percentage', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 150000,
          capitalOriginal: 100000,
          successFeePct: 0,
        });

        expect(result.utilidad).toBe(50000);
        expect(result.successFee).toBe(0);
        expect(result.montoNeto).toBe(150000);
        expect(result.aplicaFee).toBe(true); // Still has utility, just 0% fee
      });

      it('should handle negative inputs gracefully', () => {
        const result = calcularSuccessFee({
          totalDistribuido: -1000,
          capitalOriginal: 100000,
          successFeePct: 20,
        });

        expect(result.successFee).toBe(0);
        expect(result.aplicaFee).toBe(false);
      });

      it('should handle very large numbers', () => {
        const result = calcularSuccessFee({
          totalDistribuido: 10000000, // 10 million
          capitalOriginal: 5000000, // 5 million
          successFeePct: 20,
        });

        expect(result.utilidad).toBe(5000000);
        expect(result.successFee).toBe(1000000);
        expect(result.montoNeto).toBe(9000000);
      });
    });
  });

  describe('calcularSuccessFeeCascada', () => {
    it('should calculate fee only on utility portion', () => {
      // From issue: $30k Pref + $70k Capital + $20k Utilidad = $120k total
      // Fee only applies to $20k utility at 20%
      const result = calcularSuccessFeeCascada({
        montoUtilidad: 20000,
        successFeePct: 20,
      });

      expect(result.successFee).toBe(4000);
    });

    it('should return zero for negative utility', () => {
      const result = calcularSuccessFeeCascada({
        montoUtilidad: -5000,
        successFeePct: 20,
      });

      expect(result.successFee).toBe(0);
    });

    it('should return zero for zero utility', () => {
      const result = calcularSuccessFeeCascada({
        montoUtilidad: 0,
        successFeePct: 20,
      });

      expect(result.successFee).toBe(0);
    });

    it('should return zero for zero percentage', () => {
      const result = calcularSuccessFeeCascada({
        montoUtilidad: 50000,
        successFeePct: 0,
      });

      expect(result.successFee).toBe(0);
    });
  });

  describe('getEffectiveSuccessFeePct', () => {
    it('should prioritize inversion over proyecto and fondo', () => {
      const result = getEffectiveSuccessFeePct({
        inversionPct: 15,
        proyectoPct: 20,
        fondoDefaultPct: 25,
      });

      expect(result).toBe(15);
    });

    it('should fallback to proyecto when inversion is null', () => {
      const result = getEffectiveSuccessFeePct({
        inversionPct: null,
        proyectoPct: 20,
        fondoDefaultPct: 25,
      });

      expect(result).toBe(20);
    });

    it('should fallback to fondo when both inversion and proyecto are null', () => {
      const result = getEffectiveSuccessFeePct({
        inversionPct: null,
        proyectoPct: null,
        fondoDefaultPct: 25,
      });

      expect(result).toBe(25);
    });

    it('should default to 20% when all are null', () => {
      const result = getEffectiveSuccessFeePct({
        inversionPct: null,
        proyectoPct: null,
        fondoDefaultPct: null,
      });

      expect(result).toBe(20);
    });

    it('should handle explicit 0% (valid value)', () => {
      const result = getEffectiveSuccessFeePct({
        inversionPct: 0,
        proyectoPct: 20,
        fondoDefaultPct: 25,
      });

      expect(result).toBe(0);
    });
  });
});
