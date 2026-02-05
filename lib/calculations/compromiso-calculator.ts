/**
 * Compromiso (Commitment) Calculator
 *
 * Functions for calculating commitment status and remaining balance.
 * Used to determine how much an investor still needs to contribute.
 *
 * @see CALC-003
 * @see BR-017: Estados del compromiso
 */

/**
 * Commitment status states.
 */
export type EstadoCompromiso = 'pendiente' | 'parcial' | 'completado' | 'excedido';

/**
 * Full commitment status including derived metrics.
 */
export interface CompromisoStatus {
  /** Remaining commitment = compromiso - capitalAportado */
  saldo: number;
  /** Percentage contributed = (capitalAportado / compromiso) * 100 */
  porcentaje: number;
  /** Current state based on contribution level */
  estado: EstadoCompromiso;
}

/**
 * Calculate full commitment status.
 *
 * States:
 * - pendiente: 0% contributed (aportado = 0)
 * - parcial: 1-99% contributed (0 < aportado < compromiso)
 * - completado: 100% contributed (aportado = compromiso)
 * - excedido: >100% contributed (aportado > compromiso)
 *
 * @example
 * // $30k contributed of $100k commitment
 * calcularCompromisoStatus(100000, 30000);
 * // Returns: { saldo: 70000, porcentaje: 30, estado: 'parcial' }
 */
export function calcularCompromisoStatus(
  compromiso: number,
  capitalAportado: number
): CompromisoStatus {
  // Handle edge cases
  if (compromiso <= 0) {
    return {
      saldo: 0,
      porcentaje: capitalAportado > 0 ? 100 : 0,
      estado: capitalAportado > 0 ? 'excedido' : 'pendiente',
    };
  }

  const saldo = compromiso - capitalAportado;
  const porcentaje = Math.round((capitalAportado / compromiso) * 100);

  // Determine state
  let estado: EstadoCompromiso;
  if (capitalAportado <= 0) {
    estado = 'pendiente';
  } else if (capitalAportado < compromiso) {
    estado = 'parcial';
  } else if (capitalAportado === compromiso) {
    estado = 'completado';
  } else {
    estado = 'excedido';
  }

  return { saldo, porcentaje, estado };
}

/**
 * Get just the remaining commitment balance.
 * Simpler version when you only need the saldo.
 *
 * Formula: saldo = compromiso - capitalAportado
 */
export function getSaldoCompromiso(compromiso: number, capitalAportado: number): number {
  return compromiso - capitalAportado;
}

/**
 * Get just the commitment state.
 * Simpler version when you only need the estado.
 */
export function getEstadoCompromiso(compromiso: number, capitalAportado: number): EstadoCompromiso {
  if (compromiso <= 0) {
    return capitalAportado > 0 ? 'excedido' : 'pendiente';
  }

  if (capitalAportado <= 0) return 'pendiente';
  if (capitalAportado < compromiso) return 'parcial';
  if (capitalAportado === compromiso) return 'completado';
  return 'excedido';
}

/**
 * Check if commitment is fully satisfied (completado or excedido).
 */
export function isCompromisoSatisfecho(compromiso: number, capitalAportado: number): boolean {
  return capitalAportado >= compromiso;
}
