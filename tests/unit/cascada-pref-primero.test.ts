/**
 * Cascada Pref Primero Calculation Tests
 *
 * @see WIZ-002
 * @see BR-036
 */

import { describe, it, expect } from 'vitest';
import {
  calcularCascadaPrefPrimero,
  type InversionCascadaInput,
} from '@/lib/calculations/cascada-pref-primero';

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

describe('calcularCascadaPrefPrimero - Edge Cases', () => {
  it('returns empty result for zero amount', () => {
    const inversiones = [createInversion()];
    const result = calcularCascadaPrefPrimero(0, inversiones);

    expect(result.distribuciones).toHaveLength(0);
    expect(result.totales.totalNeto).toBe(0);
    expect(result.meta.metodoCascada).toBe('pref_primero');
  });

  it('returns empty result for negative amount', () => {
    const inversiones = [createInversion()];
    const result = calcularCascadaPrefPrimero(-1000, inversiones);

    expect(result.distribuciones).toHaveLength(0);
  });

  it('returns empty result for empty inversiones array', () => {
    const result = calcularCascadaPrefPrimero(100000, []);

    expect(result.distribuciones).toHaveLength(0);
    expect(result.meta.inversionesCount).toBe(0);
  });

  it('handles zero capital aportado', () => {
    const inversiones = [createInversion({ capitalAportado: 0 })];
    const result = calcularCascadaPrefPrimero(10000, inversiones);

    expect(result.distribuciones).toHaveLength(0);
  });
});

// =============================================================================
// Single Investor Scenarios
// =============================================================================

describe('calcularCascadaPrefPrimero - Single Investor', () => {
  it('distributes only to Pref when amount is small', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 20000,
        prefPagado: 5000, // 15k pending
      }),
    ];
    const result = calcularCascadaPrefPrimero(10000, inversiones);

    expect(result.distribuciones).toHaveLength(1);
    const dist = result.distribuciones[0];

    // All goes to Pref (10k < 15k pending)
    expect(dist.montoAPref).toBe(10000);
    expect(dist.montoACapital).toBe(0);
    expect(dist.montoAUtilidad).toBe(0);
    expect(dist.successFee).toBe(0);
    expect(dist.montoNeto).toBe(10000);
  });

  it('distributes to Pref + partial Capital', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0, // 10k pending
      }),
    ];
    const result = calcularCascadaPrefPrimero(30000, inversiones);

    const dist = result.distribuciones[0];

    // 10k Pref, 20k Capital (no utility)
    expect(dist.montoAPref).toBe(10000);
    expect(dist.montoACapital).toBe(20000);
    expect(dist.montoAUtilidad).toBe(0);
    expect(dist.successFee).toBe(0);
    expect(dist.montoNeto).toBe(30000);
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
    // Total: 150k = 10k Pref + 100k Capital + 40k Utility
    const result = calcularCascadaPrefPrimero(150000, inversiones);

    const dist = result.distribuciones[0];

    expect(dist.montoAPref).toBe(10000);
    expect(dist.montoACapital).toBe(100000);
    expect(dist.montoAUtilidad).toBe(40000);
    expect(dist.successFee).toBe(8000); // 40k × 20%
    expect(dist.montoBruto).toBe(150000);
    expect(dist.montoNeto).toBe(142000); // 150k - 8k
  });

  it('handles no pending Pref (already paid)', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 10000, // All paid
      }),
    ];
    const result = calcularCascadaPrefPrimero(50000, inversiones);

    const dist = result.distribuciones[0];

    // No Pref, 50k to Capital
    expect(dist.montoAPref).toBe(0);
    expect(dist.montoACapital).toBe(50000);
    expect(dist.montoAUtilidad).toBe(0);
  });
});

// =============================================================================
// Multiple Investors
// =============================================================================

describe('calcularCascadaPrefPrimero - Multiple Investors', () => {
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
    // 10k total to Pref pool
    const result = calcularCascadaPrefPrimero(10000, inversiones);

    expect(result.distribuciones).toHaveLength(2);

    const juan = result.distribuciones.find((d) => d.inversionId === 'inv-1')!;
    const maria = result.distribuciones.find((d) => d.inversionId === 'inv-2')!;

    // Proportional to their pending pref
    expect(juan.montoAPref).toBe(7500);
    expect(maria.montoAPref).toBe(2500);

    // Participation percentages
    expect(juan.participacionPct).toBe(75);
    expect(maria.participacionPct).toBe(25);
  });

  it('distributes utility with different success fee rates', () => {
    const inversiones = [
      createInversion({
        inversionId: 'inv-1',
        capitalAportado: 50000,
        prefAcumulado: 0,
        prefPagado: 0,
        successFeePct: 20,
      }),
      createInversion({
        inversionId: 'inv-2',
        capitalAportado: 50000,
        prefAcumulado: 0,
        prefPagado: 0,
        successFeePct: 15, // Different rate
      }),
    ];
    // 120k = 100k capital + 20k utility
    const result = calcularCascadaPrefPrimero(120000, inversiones);

    const inv1 = result.distribuciones.find((d) => d.inversionId === 'inv-1')!;
    const inv2 = result.distribuciones.find((d) => d.inversionId === 'inv-2')!;

    // Each gets 50% of capital and utility
    expect(inv1.montoACapital).toBe(50000);
    expect(inv2.montoACapital).toBe(50000);
    expect(inv1.montoAUtilidad).toBe(10000);
    expect(inv2.montoAUtilidad).toBe(10000);

    // Different fees
    expect(inv1.successFee).toBe(2000); // 10k × 20%
    expect(inv2.successFee).toBe(1500); // 10k × 15%
  });
});

// =============================================================================
// Totals
// =============================================================================

describe('calcularCascadaPrefPrimero - Totals', () => {
  it('calculates correct totals', () => {
    const inversiones = [
      createInversion({
        capitalAportado: 100000,
        prefAcumulado: 10000,
        prefPagado: 0,
        successFeePct: 20,
      }),
    ];
    const result = calcularCascadaPrefPrimero(150000, inversiones);

    expect(result.totales.totalPref).toBe(10000);
    expect(result.totales.totalCapital).toBe(100000);
    expect(result.totales.totalUtilidad).toBe(40000);
    expect(result.totales.totalFees).toBe(8000);
    expect(result.totales.totalBruto).toBe(150000);
    expect(result.totales.totalNeto).toBe(142000);
  });

  it('includes correct metadata', () => {
    const inversiones = [createInversion(), createInversion({ inversionId: 'second' })];
    const result = calcularCascadaPrefPrimero(50000, inversiones);

    expect(result.meta.montoDistribuido).toBe(50000);
    expect(result.meta.metodoCascada).toBe('pref_primero');
    expect(result.meta.inversionesCount).toBe(2);
  });
});
