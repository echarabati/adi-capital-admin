/**
 * Compromiso (Commitment) Calculation Unit Tests
 *
 * Tests for commitment status calculation per CALC-003 scenarios.
 *
 * @see CALC-003
 * @see BR-017
 */

import { describe, it, expect } from 'vitest';
import {
  calcularCompromisoStatus,
  getSaldoCompromiso,
  getEstadoCompromiso,
  isCompromisoSatisfecho,
} from '@/lib/calculations/compromiso-calculator';

describe('Compromiso Calculation', () => {
  describe('calcularCompromisoStatus', () => {
    describe('Scenario: Saldo inicial (0% contributed)', () => {
      it('should return pendiente when capital = 0', () => {
        // From issue: compromiso $100k, capital_aportado $0
        const result = calcularCompromisoStatus(100000, 0);

        expect(result.saldo).toBe(100000);
        expect(result.porcentaje).toBe(0);
        expect(result.estado).toBe('pendiente');
      });
    });

    describe('Scenario: Aportación parcial', () => {
      it('should return parcial when 30% contributed', () => {
        // From issue: Juan aporta $30k of $100k
        const result = calcularCompromisoStatus(100000, 30000);

        expect(result.saldo).toBe(70000);
        expect(result.porcentaje).toBe(30);
        expect(result.estado).toBe('parcial');
      });

      it('should return parcial when 1% contributed', () => {
        const result = calcularCompromisoStatus(100000, 1000);

        expect(result.saldo).toBe(99000);
        expect(result.porcentaje).toBe(1);
        expect(result.estado).toBe('parcial');
      });

      it('should return parcial when 99% contributed', () => {
        const result = calcularCompromisoStatus(100000, 99000);

        expect(result.saldo).toBe(1000);
        expect(result.porcentaje).toBe(99);
        expect(result.estado).toBe('parcial');
      });
    });

    describe('Scenario: Compromiso completado', () => {
      it('should return completado when 100% contributed', () => {
        // From issue: aportado = compromiso
        const result = calcularCompromisoStatus(100000, 100000);

        expect(result.saldo).toBe(0);
        expect(result.porcentaje).toBe(100);
        expect(result.estado).toBe('completado');
      });
    });

    describe('Scenario: Compromiso excedido', () => {
      it('should return excedido when over-contributed', () => {
        // From issue: aportó $120k > compromiso $100k
        const result = calcularCompromisoStatus(100000, 120000);

        expect(result.saldo).toBe(-20000);
        expect(result.porcentaje).toBe(120);
        expect(result.estado).toBe('excedido');
      });

      it('should handle large excess', () => {
        const result = calcularCompromisoStatus(100000, 200000);

        expect(result.saldo).toBe(-100000);
        expect(result.porcentaje).toBe(200);
        expect(result.estado).toBe('excedido');
      });
    });

    describe('Edge cases', () => {
      it('should handle zero compromiso', () => {
        const result = calcularCompromisoStatus(0, 0);

        expect(result.saldo).toBe(0);
        expect(result.estado).toBe('pendiente');
      });

      it('should handle zero compromiso with contribution', () => {
        const result = calcularCompromisoStatus(0, 50000);

        expect(result.saldo).toBe(0);
        expect(result.estado).toBe('excedido');
      });

      it('should round percentage correctly', () => {
        // 33333 / 100000 = 33.333%
        const result = calcularCompromisoStatus(100000, 33333);

        expect(result.porcentaje).toBe(33);
      });
    });
  });

  describe('getSaldoCompromiso', () => {
    it('should calculate remaining balance', () => {
      expect(getSaldoCompromiso(100000, 30000)).toBe(70000);
      expect(getSaldoCompromiso(100000, 0)).toBe(100000);
      expect(getSaldoCompromiso(100000, 100000)).toBe(0);
      expect(getSaldoCompromiso(100000, 120000)).toBe(-20000);
    });
  });

  describe('getEstadoCompromiso', () => {
    it('should return correct state for each scenario', () => {
      expect(getEstadoCompromiso(100000, 0)).toBe('pendiente');
      expect(getEstadoCompromiso(100000, 50000)).toBe('parcial');
      expect(getEstadoCompromiso(100000, 100000)).toBe('completado');
      expect(getEstadoCompromiso(100000, 150000)).toBe('excedido');
    });
  });

  describe('isCompromisoSatisfecho', () => {
    it('should return true when fully contributed or exceeded', () => {
      expect(isCompromisoSatisfecho(100000, 100000)).toBe(true);
      expect(isCompromisoSatisfecho(100000, 150000)).toBe(true);
    });

    it('should return false when not fully contributed', () => {
      expect(isCompromisoSatisfecho(100000, 0)).toBe(false);
      expect(isCompromisoSatisfecho(100000, 99999)).toBe(false);
    });
  });
});
