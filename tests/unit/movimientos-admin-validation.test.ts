/**
 * Movimientos Admin Validation Tests
 *
 * Tests for Admin concepto helpers (isAdminConcepto, requiresTipoCambio)
 * @see MOV-010
 */

import { describe, it, expect } from 'vitest';
import {
  isAdminConcepto,
  requiresTipoCambio,
  ADMIN_CONCEPTOS,
  TIPO_CAMBIO_REQUIRED_CONCEPTOS,
  type Concepto,
} from '@/lib/validations/movimientos/movimientos-validation';

describe('isAdminConcepto', () => {
  it('should return true for Admin conceptos (TRA, CAM, ERR, TSI)', () => {
    const adminConceptos: Concepto[] = ['TRA', 'CAM', 'ERR', 'TSI'];

    for (const concepto of adminConceptos) {
      expect(isAdminConcepto(concepto)).toBe(true);
    }
  });

  it('should return false for non-Admin conceptos', () => {
    const nonAdminConceptos: Concepto[] = [
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
      'APS',
      'RPS',
      'PRS',
      'DPRS',
    ];

    for (const concepto of nonAdminConceptos) {
      expect(isAdminConcepto(concepto)).toBe(false);
    }
  });

  it('should have ADMIN_CONCEPTOS constant with correct values', () => {
    expect(ADMIN_CONCEPTOS).toEqual(['TRA', 'CAM', 'ERR', 'TSI']);
  });
});

describe('requiresTipoCambio', () => {
  it('should return true for CAM concepto', () => {
    expect(requiresTipoCambio('CAM')).toBe(true);
  });

  it('should return false for other Admin conceptos', () => {
    expect(requiresTipoCambio('TRA')).toBe(false);
    expect(requiresTipoCambio('ERR')).toBe(false);
    expect(requiresTipoCambio('TSI')).toBe(false);
  });

  it('should return false for non-Admin conceptos', () => {
    const nonAdminConceptos: Concepto[] = ['APO', 'DIS', 'INV', 'GAS', 'APS'];

    for (const concepto of nonAdminConceptos) {
      expect(requiresTipoCambio(concepto)).toBe(false);
    }
  });

  it('should have TIPO_CAMBIO_REQUIRED_CONCEPTOS constant with correct values', () => {
    expect(TIPO_CAMBIO_REQUIRED_CONCEPTOS).toEqual(['CAM']);
  });
});
