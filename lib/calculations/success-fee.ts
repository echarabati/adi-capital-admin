/**
 * Success Fee Calculation Utility
 *
 * Calculates success fee on investment distributions per BR-040/BR-041.
 * Used exclusively by the Wizard de Reparto.
 *
 * @see CALC-002
 * @see BR-040: Success Fee = utilidad × (success_fee_pct / 100)
 * @see BR-041: Success Fee = 0 if utilidad <= 0
 */

/**
 * Input for success fee calculation.
 */
export interface SuccessFeeInput {
  /** Total amount being distributed to the investor */
  totalDistribuido: number;
  /** Original investment capital (capital_aportado) */
  capitalOriginal: number;
  /** Success fee percentage from project/investment (e.g., 20 for 20%) */
  successFeePct: number;
}

/**
 * Result of success fee calculation.
 */
export interface SuccessFeeResult {
  /** Profit = totalDistribuido - capitalOriginal (can be negative) */
  utilidad: number;
  /** Success fee amount (0 if no profit) */
  successFee: number;
  /** Net amount after fee = totalDistribuido - successFee */
  montoNeto: number;
  /** Whether a fee applies (utilidad > 0) */
  aplicaFee: boolean;
}

/**
 * Calculate success fee on a distribution.
 *
 * Formula (BR-040):
 *   utilidad = totalDistribuido - capitalOriginal
 *   successFee = max(0, utilidad × successFeePct / 100)
 *
 * Only applies to positive utility (BR-041).
 *
 * @example
 * // $150k distribution on $100k investment at 20% fee
 * calcularSuccessFee({
 *   totalDistribuido: 150000,
 *   capitalOriginal: 100000,
 *   successFeePct: 20
 * })
 * // Returns: { utilidad: 50000, successFee: 10000, montoNeto: 140000, aplicaFee: true }
 */
export function calcularSuccessFee(input: SuccessFeeInput): SuccessFeeResult {
  const { totalDistribuido, capitalOriginal, successFeePct } = input;

  // Validate inputs
  if (totalDistribuido < 0 || capitalOriginal < 0 || successFeePct < 0) {
    return {
      utilidad: 0,
      successFee: 0,
      montoNeto: Math.max(0, totalDistribuido),
      aplicaFee: false,
    };
  }

  // Calculate utility (profit)
  const utilidad = totalDistribuido - capitalOriginal;

  // BR-041: No fee if no profit
  if (utilidad <= 0) {
    return {
      utilidad,
      successFee: 0,
      montoNeto: totalDistribuido,
      aplicaFee: false,
    };
  }

  // BR-040: Calculate fee on profit
  const successFee = utilidad * (successFeePct / 100);
  const montoNeto = totalDistribuido - successFee;

  return {
    utilidad,
    successFee,
    montoNeto,
    aplicaFee: true,
  };
}

/**
 * Calculate success fee for a cascada distribution breakdown.
 *
 * When a distribution is split into Pref, Capital, and Utilidad portions,
 * the success fee only applies to the Utilidad portion.
 *
 * @example
 * // Distribution breakdown: $30k Pref, $70k Capital, $20k Utilidad at 20% fee
 * calcularSuccessFeeCascada({
 *   montoUtilidad: 20000,
 *   successFeePct: 20
 * })
 * // Returns: { successFee: 4000 }
 */
export function calcularSuccessFeeCascada(input: {
  montoUtilidad: number;
  successFeePct: number;
}): { successFee: number } {
  const { montoUtilidad, successFeePct } = input;

  // Only positive utility generates fee
  if (montoUtilidad <= 0 || successFeePct <= 0) {
    return { successFee: 0 };
  }

  const successFee = montoUtilidad * (successFeePct / 100);
  return { successFee };
}

/**
 * Get the effective success fee percentage for an investment.
 *
 * Priority: inversion.successFeePct > proyecto.successFeePct > fondo.successFeeDefault
 */
export function getEffectiveSuccessFeePct(options: {
  inversionPct?: number | null;
  proyectoPct?: number | null;
  fondoDefaultPct?: number | null;
}): number {
  const { inversionPct, proyectoPct, fondoDefaultPct } = options;

  if (inversionPct != null && inversionPct >= 0) {
    return inversionPct;
  }
  if (proyectoPct != null && proyectoPct >= 0) {
    return proyectoPct;
  }
  if (fondoDefaultPct != null && fondoDefaultPct >= 0) {
    return fondoDefaultPct;
  }

  // Default to 20% if nothing configured
  return 20;
}
