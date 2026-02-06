/**
 * Reversal Calculator
 *
 * Calculates field adjustments when cancelling confirmed movements.
 * Used by cancelMovimiento to revert cached investment fields.
 *
 * @see CALC-004
 * @see BR-024: Cancelación es reversión lógica
 */

/**
 * Movement concepts that affect investment fields.
 */
export type ReversibleConcepto = 'APO' | 'APO-D' | 'DEV' | 'DIS' | 'FEE';

/**
 * Distribution destination types.
 */
export type DestinoDistribucion = 'a_pref' | 'a_capital' | 'a_utilidad';

/**
 * Reversal deltas for investment fields.
 * Positive values = add back, Negative values = subtract.
 */
export interface ReversalResult {
  /** Delta for inversiones.capitalAportado */
  capitalAportadoDelta: number;
  /** Delta for inversiones.prefPagado */
  prefPagadoDelta: number;
  /** Whether this concepto affects investment fields */
  afectsInversion: boolean;
}

/**
 * Calculate the reversal deltas for a cancelled movement.
 *
 * When cancelling a confirmed movement, we need to reverse its effects:
 * - APO/APO-D: Were adding to capital → subtract on cancel
 * - DEV: Was subtracting from capital → add back on cancel
 * - DIS a_pref: Was adding to prefPagado → subtract on cancel
 * - DIS a_capital: Was subtracting capital → add back on cancel
 *
 * @example
 * // Cancelling an APO of $30,000
 * calcularReversal('APO', 30000);
 * // Returns: { capitalAportadoDelta: -30000, prefPagadoDelta: 0, afectsInversion: true }
 *
 * // Cancelling a DIS a_pref of $10,000
 * calcularReversal('DIS', 10000, 'a_pref');
 * // Returns: { capitalAportadoDelta: 0, prefPagadoDelta: -10000, afectsInversion: true }
 */
export function calcularReversal(
  concepto: string,
  monto: number,
  destino?: DestinoDistribucion | null
): ReversalResult {
  // Default: no effect
  const result: ReversalResult = {
    capitalAportadoDelta: 0,
    prefPagadoDelta: 0,
    afectsInversion: false,
  };

  // Validate monto
  if (monto <= 0) {
    return result;
  }

  switch (concepto) {
    case 'APO':
    case 'APO-D':
      // APO adds to capital, so cancel subtracts
      result.capitalAportadoDelta = -monto;
      result.afectsInversion = true;
      break;

    case 'DEV':
      // DEV subtracts from capital, so cancel adds back
      result.capitalAportadoDelta = monto;
      result.afectsInversion = true;
      break;

    case 'DIS':
      // DIS effect depends on destino
      if (destino === 'a_pref') {
        // Pref payment: adds to prefPagado, so cancel subtracts
        result.prefPagadoDelta = -monto;
        result.afectsInversion = true;
      } else if (destino === 'a_capital') {
        // Capital return: subtracts from capital, so cancel adds back
        result.capitalAportadoDelta = monto;
        result.afectsInversion = true;
      }
      // 'a_utilidad' doesn't affect cached fields
      break;

    case 'FEE':
      // FEE doesn't affect investment fields directly
      break;

    default:
      // Other conceptos don't affect investment fields
      break;
  }

  return result;
}

/**
 * Check if a movement concepto requires reversal logic.
 */
export function requiresReversal(concepto: string): boolean {
  return ['APO', 'APO-D', 'DEV', 'DIS'].includes(concepto);
}

/**
 * Get a human-readable description of the reversal action.
 */
export function getReversalDescription(
  concepto: string,
  monto: number,
  destino?: DestinoDistribucion | null
): string {
  const formatted = `$${monto.toLocaleString()}`;

  switch (concepto) {
    case 'APO':
    case 'APO-D':
      return `Restar ${formatted} de capital aportado`;
    case 'DEV':
      return `Sumar ${formatted} a capital aportado`;
    case 'DIS':
      if (destino === 'a_pref') {
        return `Restar ${formatted} de pref pagado`;
      } else if (destino === 'a_capital') {
        return `Sumar ${formatted} a capital aportado`;
      }
      return 'Sin efecto en campos';
    default:
      return 'Sin efecto en campos';
  }
}
