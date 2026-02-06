/**
 * Cascada Pref Primero Calculation
 *
 * Implements "Pref Primero" waterfall distribution (Adi Capital method).
 * Pure calculation module without DB dependencies.
 *
 * Waterfall order (BR-036):
 *   1. Pay pending Pref (prefAcumulado - prefPagado)
 *   2. Return invested capital (capitalAportado)
 *   3. Distribute profit (applies Success Fee)
 *
 * @see WIZ-002
 * @see BR-036: Cascada Pref Primero
 */

import { calcularSuccessFeeCascada } from './success-fee';

// =============================================================================
// Types
// =============================================================================

/**
 * Input data for a single investment in the cascade calculation.
 */
export interface InversionCascadaInput {
  /** Investment UUID */
  inversionId: string;
  /** Investor name for display */
  inversionistaNombre: string;
  /** Total capital contributed (cached field) */
  capitalAportado: number;
  /** Accumulated preferred return (cached field) */
  prefAcumulado: number;
  /** Already paid preferred return (cached field) */
  prefPagado: number;
  /** Success fee percentage (effective, already resolved from hierarchy) */
  successFeePct: number;
}

/**
 * Distribution breakdown for a single investment.
 */
export interface DistribucionInversion {
  /** Investment UUID */
  inversionId: string;
  /** Investor name */
  inversionistaNombre: string;
  /** Participation percentage (0-100) */
  participacionPct: number;
  /** Amount allocated to pending Pref */
  montoAPref: number;
  /** Amount allocated to capital return */
  montoACapital: number;
  /** Amount allocated to profit (before fee) */
  montoAUtilidad: number;
  /** Success fee deducted from profit */
  successFee: number;
  /** Net amount to investor (sum - fee) */
  montoNeto: number;
  /** Total gross distribution (before fee) */
  montoBruto: number;
}

/**
 * Complete cascade calculation result.
 */
export interface CascadaResult {
  /** Per-investment distribution breakdown */
  distribuciones: DistribucionInversion[];
  /** Aggregated totals */
  totales: {
    totalPref: number;
    totalCapital: number;
    totalUtilidad: number;
    totalFees: number;
    totalNeto: number;
    totalBruto: number;
  };
  /** Calculation metadata */
  meta: {
    montoDistribuido: number;
    metodoCascada: 'pref_primero' | 'capital_primero';
    inversionesCount: number;
  };
}

// =============================================================================
// Main Calculation Function
// =============================================================================

/**
 * Calculate waterfall distribution using "Pref Primero" method.
 *
 * Distribution order:
 *   1. Pay pending Pref to all investors proportionally
 *   2. Return invested capital proportionally
 *   3. Distribute remaining as profit (with Success Fee)
 *
 * @param montoTotal - Total amount to distribute
 * @param inversiones - Array of investment data
 * @returns Complete cascade result with per-investor breakdown
 *
 * @example
 * const result = calcularCascadaPrefPrimero(150000, [
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
export function calcularCascadaPrefPrimero(
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

  // Calculate pending pref and capital needs for each investor
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
  const totalPrefPendiente = inversionesConPesos.reduce((sum, inv) => sum + inv.prefPendiente, 0);
  const totalCapitalAportado = totalCapital;

  // Distribute according to waterfall
  const distribuciones: DistribucionInversion[] = [];

  // Initialize totals
  let totalPref = 0;
  let totalCapitalDist = 0;
  let totalUtilidad = 0;
  let totalFees = 0;

  for (const inv of inversionesConPesos) {
    // Step 1: Pref (proportional to their pending pref)
    let montoAPref = 0;
    if (totalPrefPendiente > 0 && inv.prefPendiente > 0) {
      // Proportional share of available pref pool
      const prefPool = Math.min(montoTotal, totalPrefPendiente);
      montoAPref = (inv.prefPendiente / totalPrefPendiente) * prefPool;
      montoAPref = Math.min(montoAPref, inv.prefPendiente); // Don't exceed pending
    }

    // Step 2: Capital (proportional to their capital aportado)
    let montoACapital = 0;
    const capitalPool = Math.max(0, montoTotal - totalPrefPendiente);
    if (capitalPool > 0 && inv.capitalAportado > 0) {
      const maxCapitalPool = Math.min(capitalPool, totalCapitalAportado);
      montoACapital = (inv.capitalAportado / totalCapitalAportado) * maxCapitalPool;
      montoACapital = Math.min(montoACapital, inv.capitalAportado); // Don't exceed capital
    }

    // Step 3: Utilidad (proportional to participation)
    let montoAUtilidad = 0;
    const utilidadPool = Math.max(0, montoTotal - totalPrefPendiente - totalCapitalAportado);
    if (utilidadPool > 0) {
      montoAUtilidad = (inv.participacionPct / 100) * utilidadPool;
    }

    // Calculate Success Fee on utility portion
    const { successFee } = calcularSuccessFeeCascada({
      montoUtilidad: montoAUtilidad,
      successFeePct: inv.successFeePct,
    });

    // Calculate totals for this investor
    const montoBruto = montoAPref + montoACapital + montoAUtilidad;
    const montoNeto = montoBruto - successFee;

    // Accumulate totals
    totalPref += montoAPref;
    totalCapitalDist += montoACapital;
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
      totalNeto: totalPref + totalCapitalDist + totalUtilidad - totalFees,
      totalBruto: montoTotal,
    },
    meta: {
      montoDistribuido: montoTotal,
      metodoCascada: 'pref_primero',
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
      metodoCascada: 'pref_primero',
      inversionesCount: 0,
    },
  };
}
