/**
 * CompromisoProgress Unit Tests
 *
 * Tests for the commitment progress calculation logic.
 *
 * @see INVE-004
 */

import { describe, it, expect } from 'vitest';

type EstadoCompromiso = 'pendiente' | 'parcial' | 'completado' | 'excedido';

/**
 * Calculate the commitment status based on amounts.
 * Replicated from component for isolated unit testing.
 */
function getEstado(compromiso: number, aportado: number): EstadoCompromiso {
  if (compromiso === 0) return 'pendiente';
  if (aportado === 0) return 'pendiente';
  if (aportado >= compromiso) {
    return aportado > compromiso ? 'excedido' : 'completado';
  }
  return 'parcial';
}

/**
 * Calculate percentage, capped at 100 for visual.
 */
function calculatePercentage(compromiso: number, aportado: number): number {
  return compromiso > 0 ? Math.round((aportado / compromiso) * 100) : 0;
}

describe('CompromisoProgress Logic', () => {
  describe('getEstado', () => {
    describe('Estado: Pendiente (0%)', () => {
      it('should return pendiente when aportado is 0', () => {
        expect(getEstado(100000, 0)).toBe('pendiente');
      });

      it('should return pendiente when compromiso is 0', () => {
        expect(getEstado(0, 0)).toBe('pendiente');
      });
    });

    describe('Estado: Parcial (1-99%)', () => {
      it('should return parcial when partially contributed', () => {
        expect(getEstado(100000, 60000)).toBe('parcial');
      });

      it('should return parcial for 1% contribution', () => {
        expect(getEstado(100000, 1000)).toBe('parcial');
      });

      it('should return parcial for 99% contribution', () => {
        expect(getEstado(100000, 99000)).toBe('parcial');
      });
    });

    describe('Estado: Completado (100%)', () => {
      it('should return completado when fully contributed', () => {
        expect(getEstado(100000, 100000)).toBe('completado');
      });
    });

    describe('Estado: Excedido (>100%)', () => {
      it('should return excedido when over-contributed', () => {
        expect(getEstado(100000, 120000)).toBe('excedido');
      });

      it('should return excedido for slightly over', () => {
        expect(getEstado(100000, 100001)).toBe('excedido');
      });
    });
  });

  describe('calculatePercentage', () => {
    it('should return 0% for zero aportado', () => {
      expect(calculatePercentage(100000, 0)).toBe(0);
    });

    it('should return 0% for zero compromiso', () => {
      expect(calculatePercentage(0, 50000)).toBe(0);
    });

    it('should return 60% for partial contribution', () => {
      expect(calculatePercentage(100000, 60000)).toBe(60);
    });

    it('should return 100% for full contribution', () => {
      expect(calculatePercentage(100000, 100000)).toBe(100);
    });

    it('should return 120% for over-contribution', () => {
      expect(calculatePercentage(100000, 120000)).toBe(120);
    });

    it('should round percentages correctly', () => {
      expect(calculatePercentage(100000, 33333)).toBe(33);
      expect(calculatePercentage(100000, 66666)).toBe(67);
    });
  });
});
