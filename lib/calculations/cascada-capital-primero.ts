/**
 * Cascada Capital Primero Calculation
 *
 * Implements "Capital Primero" waterfall distribution (Kentucky method).
 * Pure calculation module without DB dependencies.
 *
 * Waterfall order (BR-037):
 *   1. Return invested capital (capitalAportado)
 *   2. Pay Pref (recalculated on remaining capital base)
 *   3. Distribute profit (applies Success Fee)
 *
 * Key difference from Pref Primero: Pref is calculated on the reduced
 * capital base after capital returns, making this method more favorable
 * to the fund.
 *
 * @see WIZ-003
 * @see BR-037: Cascada Capital Primero
 */

import { calcularSuccessFeeCascada } from './success-fee';
import type {
  InversionCascadaInput,
  DistribucionInversion,
  CascadaResult,
} from './cascada-pref-primero';

// Re-export types for convenience
export type { InversionCascadaInput, DistribucionInversion, CascadaResult };

// =============================================================================
// Main Calculation Function
// =============================================================================

/**
 * Calculate waterfall distribution using "Capital Primero" method.
 *
 * Distribution order:
 *   1. Return invested capital proportionally
 *   2. Pay Pref (recalculated on remaining capital after returns)
 *   3. Distribute remaining as profit (with Success Fee)
 *
 * @param montoTotal - Total amount to distribute
 * @param inversiones - Array of investment data
 * @returns Complete cascade result with per-investor breakdown
 *
 * @example
 * const result = calcularCascadaCapitalPrimero(150000, [
 *   {
 *     inversionId: 'uuid-1',
 *     inversionistaNombre: 'Juan Pérez',
 *     capitalAportado: 100000,
 *     prefAcumulado: 15000,
 *     prefPagado: 5000,
 *     successFeePct: 20,
 *   }
 * ]);
 */
export function calcularCascadaCapitalPrimero(
  montoTotal: number,
  inversiones: InversionCascadaInput[]
): CascadaResult {
  // Edge cases
  if (montoTotal <= 0 || inversiones.length === 0) {
    return createEmptyResult(montoTotal);
  }

  // Calculate participation weights based on capital aportado
  const totalCapital = inversiones.reduce((sum, inv) => sum + inv.capitalAportado, 0);

  if (totalCapital <= 0) {
    return createEmptyResult(montoTotal);
  }

  // Calculate needs for each investor
  const inversionesConPesos = inversiones.map((inv) => {
    const participacionPct = (inv.capitalAportado / totalCapital) * 100;
    const prefPendiente = Math.max(0, inv.prefAcumulado - inv.prefPagado);
    return {
      ...inv,
      participacionPct,
      prefPendiente,
    };
  });

  // Calculate totals needed
  const totalCapitalAportado = totalCapital;
  const totalPrefPendiente = inversionesConPesos.reduce((sum, inv) => sum + inv.prefPendiente, 0);

  // Distribute according to waterfall
  const distribuciones: DistribucionInversion[] = [];

  // Initialize totals
  let totalCapitalDist = 0;
  let totalPref = 0;
  let totalUtilidad = 0;
  let totalFees = 0;

  for (const inv of inversionesConPesos) {
    // Step 1: Capital (proportional to their capital aportado)
    let montoACapital = 0;
    const capitalPool = Math.min(montoTotal, totalCapitalAportado);
    if (capitalPool > 0 && inv.capitalAportado > 0) {
      montoACapital = (inv.capitalAportado / totalCapitalAportado) * capitalPool;
      montoACapital = Math.min(montoACapital, inv.capitalAportado);
    }

    // Calculate remaining capital base after this distribution
    const _capitalRestante = inv.capitalAportado - montoACapital;

    // Step 2: Pref (on reduced capital base)
    // Key difference: Pref pendiente is recalculated proportionally to capital returned
    let montoAPref = 0;
    const prefPool = Math.max(0, montoTotal - totalCapitalAportado);
    if (prefPool > 0 && inv.prefPendiente > 0 && totalPrefPendiente > 0) {
      // Pro-rata based on their pending pref share
      const maxPrefPool = Math.min(prefPool, totalPrefPendiente);
      montoAPref = (inv.prefPendiente / totalPrefPendiente) * maxPrefPool;
      montoAPref = Math.min(montoAPref, inv.prefPendiente);
    }

    // Step 3: Utilidad (proportional to participation)
    let montoAUtilidad = 0;
    const utilidadPool = Math.max(0, montoTotal - totalCapitalAportado - totalPrefPendiente);
    if (utilidadPool > 0) {
      montoAUtilidad = (inv.participacionPct / 100) * utilidadPool;
    }

    // Calculate Success Fee on utility portion
    const { successFee } = calcularSuccessFeeCascada({
      montoUtilidad: montoAUtilidad,
      successFeePct: inv.successFeePct,
    });

    // Calculate totals for this investor
    const montoBruto = montoACapital + montoAPref + montoAUtilidad;
    const montoNeto = montoBruto - successFee;

    // Accumulate totals
    totalCapitalDist += montoACapital;
    totalPref += montoAPref;
    totalUtilidad += montoAUtilidad;
    totalFees += successFee;

    distribuciones.push({
      inversionId: inv.inversionId,
      inversionistaNombre: inv.inversionistaNombre,
      participacionPct: inv.participacionPct,
      montoAPref,
      montoACapital,
      montoAUtilidad,
      successFee,
      montoBruto,
      montoNeto,
    });
  }

  return {
    distribuciones,
    totales: {
      totalPref,
      totalCapital: totalCapitalDist,
      totalUtilidad,
      totalFees,
      totalNeto: totalCapitalDist + totalPref + totalUtilidad - totalFees,
      totalBruto: montoTotal,
    },
    meta: {
      montoDistribuido: montoTotal,
      metodoCascada: 'capital_primero' as const,
      inversionesCount: inversiones.length,
    },
  };
}

// =============================================================================
// Helpers
// =============================================================================

function createEmptyResult(montoTotal: number): CascadaResult {
  return {
    distribuciones: [],
    totales: {
      totalPref: 0,
      totalCapital: 0,
      totalUtilidad: 0,
      totalFees: 0,
      totalNeto: 0,
      totalBruto: montoTotal,
    },
    meta: {
      montoDistribuido: montoTotal,
      metodoCascada: 'capital_primero' as const,
      inversionesCount: 0,
    },
  };
}
