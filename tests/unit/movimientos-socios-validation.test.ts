/**
 * Movimientos Socios Validation Tests
 *
 * Tests for Socios concepto helpers (isSociosConcepto, requiresPorcentaje)
 * @see MOV-009
 */

import { describe, it, expect } from 'vitest';
import {
  isSociosConcepto,
  requiresPorcentaje,
  SOCIOS_CONCEPTOS,
  PORCENTAJE_CONCEPTOS,
  type Concepto,
} from '@/lib/validations/movimientos/movimientos-validation';

describe('isSociosConcepto', () => {
  it('should return true for Socios conceptos (APS, RPS, PRS, DPRS)', () => {
    const sociosConceptos: Concepto[] = ['APS', 'RPS', 'PRS', 'DPRS'];

    for (const concepto of sociosConceptos) {
      expect(isSociosConcepto(concepto)).toBe(true);
    }
  });

  it('should return false for non-Socios conceptos', () => {
    const nonSociosConceptos: Concepto[] = [
      'APO',
      'APO-D',
      'DIS',
      'DEV',
      'FEE',
      'INV',
      'INV-D',
      'RET',
      'GAS',
      'GASP',
      'TRA',
      'CAM',
      'ERR',
      'TSI',
    ];

    for (const concepto of nonSociosConceptos) {
      expect(isSociosConcepto(concepto)).toBe(false);
    }
  });

  it('should have SOCIOS_CONCEPTOS constant with correct values', () => {
    expect(SOCIOS_CONCEPTOS).toEqual(['APS', 'RPS', 'PRS', 'DPRS']);
  });
});

describe('requiresPorcentaje', () => {
  it('should return true for PRS and DPRS', () => {
    expect(requiresPorcentaje('PRS')).toBe(true);
    expect(requiresPorcentaje('DPRS')).toBe(true);
  });

  it('should return false for APS and RPS', () => {
    expect(requiresPorcentaje('APS')).toBe(false);
    expect(requiresPorcentaje('RPS')).toBe(false);
  });

  it('should return false for non-Socios conceptos', () => {
    const nonSociosConceptos: Concepto[] = ['APO', 'DIS', 'INV', 'GAS'];

    for (const concepto of nonSociosConceptos) {
      expect(requiresPorcentaje(concepto)).toBe(false);
    }
  });

  it('should have PORCENTAJE_CONCEPTOS constant with correct values', () => {
    expect(PORCENTAJE_CONCEPTOS).toEqual(['PRS', 'DPRS']);
  });
});
