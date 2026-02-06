/**
 * Cascada Capital Primero Calculation Tests
 *
 * @see WIZ-003
 * @see BR-037
 */

import { describe, it, expect } from 'vitest';
import {
  calcularCascadaCapitalPrimero,
  type InversionCascadaInput,
} from '@/lib/calculations/cascada-capital-primero';

// =============================================================================
// Test Helpers
// =============================================================================

function createInversion(overrides: Partial<InversionCascadaInput> = {}): InversionCascadaInput {
  return {
    inversionId: 'test-uuid',
    inversionistaNombre: 'Test Investor',
    capitalAportado: 100000,
    prefAcumulado: 10000,
    prefPagado: 0,
    successFeePct: 20,
    ...overrides,
  };
}

// =============================================================================
// Edge Cases
// =============================================================================

describe('calcularCascadaCapitalPrimero - Edge Cases', () => {
  it('returns empty result for zero amount', () => {
    const inversiones = [createInversion()];
    const result = calcularCascadaCapitalPrimero(0, inversiones);

    expect(result.distribuciones).toHaveLength(0);
    expect(result.totales.totalNeto).toBe(0);
    expect(result.meta.metodoCascada).toBe('capital_primero');
  });

  it('returns empty result for negative amount', () => {
    const inversiones = [createInversion()];
    const result = calcularCascadaCapitalPrimero(-1000, inversiones);

    expect(result.distribuciones).toHaveLength(0);
  });

  it('returns empty result for empty inversiones array', () => {
    const result = calcularCascadaCapitalPrimero(100000, []);

    expect(result.distribuciones).toHaveLength(0);
    expect(result.meta.inversionesCount).toBe(0);
  });

  it('handles zero capital aportado', () => {
    const inversiones = [createInversion({ capitalAportado: 0 })];
    const result = calcularCascadaCapitalPrimero(10000, inversiones);

    expect(result.distribuciones).toHaveLength(0);
  });
});

// =============================================================================
// Single Investor Scenarios
// =============================================================================

describe('calcularCascadaCapitalPrimero - Single Investor', () => {
  it('distributes only to Capital when amount is small', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0,
      }),
    ];
    const result = calcularCascadaCapitalPrimero(50000, inversiones);

    expect(result.distribuciones).toHaveLength(1);
    const dist = result.distribuciones[0];

    // All goes to Capital first (50k < 100k capital)
    expect(dist.montoACapital).toBe(50000);
    expect(dist.montoAPref).toBe(0);
    expect(dist.montoAUtilidad).toBe(0);
    expect(dist.successFee).toBe(0);
    expect(dist.montoNeto).toBe(50000);
  });

  it('distributes to Capital + Pref', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0,
      }),
    ];
    // 105k = 100k capital + 5k pref
    const result = calcularCascadaCapitalPrimero(105000, inversiones);

    const dist = result.distribuciones[0];

    expect(dist.montoACapital).toBe(100000);
    expect(dist.montoAPref).toBe(5000);
    expect(dist.montoAUtilidad).toBe(0);
    expect(dist.successFee).toBe(0);
  });

  it('distributes full waterfall with utility and fee', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0,
        successFeePct: 20,
      }),
    ];
    // Total: 150k = 100k Capital + 10k Pref + 40k Utility
    const result = calcularCascadaCapitalPrimero(150000, inversiones);

    const dist = result.distribuciones[0];

    expect(dist.montoACapital).toBe(100000);
    expect(dist.montoAPref).toBe(10000);
    expect(dist.montoAUtilidad).toBe(40000);
    expect(dist.successFee).toBe(8000); // 40k × 20%
    expect(dist.montoBruto).toBe(150000);
    expect(dist.montoNeto).toBe(142000);
  });

  it('handles no pending Pref', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 10000, // All paid
      }),
    ];
    // 120k = 100k capital + 20k utility
    const result = calcularCascadaCapitalPrimero(120000, inversiones);

    const dist = result.distribuciones[0];

    expect(dist.montoACapital).toBe(100000);
    expect(dist.montoAPref).toBe(0);
    expect(dist.montoAUtilidad).toBe(20000);
  });
});

// =============================================================================
// Multiple Investors
// =============================================================================

describe('calcularCascadaCapitalPrimero - Multiple Investors', () => {
  it('distributes proportionally based on capital', () => {
    const inversiones = [
      createInversion({
        inversionId: 'inv-1',
        inversionistaNombre: 'Juan',
        capitalAportado: 75000, // 75%
        prefAcumulado: 7500,
        prefPagado: 0,
      }),
      createInversion({
        inversionId: 'inv-2',
        inversionistaNombre: 'María',
        capitalAportado: 25000, // 25%
        prefAcumulado: 2500,
        prefPagado: 0,
      }),
    ];
    // 50k total to Capital pool
    const result = calcularCascadaCapitalPrimero(50000, inversiones);

    expect(result.distribuciones).toHaveLength(2);

    const juan = result.distribuciones.find((d) => d.inversionId === 'inv-1')!;
    const maria = result.distribuciones.find((d) => d.inversionId === 'inv-2')!;

    // Proportional to their capital
    expect(juan.montoACapital).toBe(37500); // 75% of 50k
    expect(maria.montoACapital).toBe(12500); // 25% of 50k

    expect(juan.participacionPct).toBe(75);
    expect(maria.participacionPct).toBe(25);
  });
});

// =============================================================================
// Totals and Metadata
// =============================================================================

describe('calcularCascadaCapitalPrimero - Totals', () => {
  it('calculates correct totals', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0,
        successFeePct: 20,
      }),
    ];
    const result = calcularCascadaCapitalPrimero(150000, inversiones);

    expect(result.totales.totalCapital).toBe(100000);
    expect(result.totales.totalPref).toBe(10000);
    expect(result.totales.totalUtilidad).toBe(40000);
    expect(result.totales.totalFees).toBe(8000);
    expect(result.totales.totalBruto).toBe(150000);
    expect(result.totales.totalNeto).toBe(142000);
  });

  it('includes correct metadata', () => {
    const inversiones = [createInversion()];
    const result = calcularCascadaCapitalPrimero(50000, inversiones);

    expect(result.meta.montoDistribuido).toBe(50000);
    expect(result.meta.metodoCascada).toBe('capital_primero');
    expect(result.meta.inversionesCount).toBe(1);
  });
});
