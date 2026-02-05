/**
 * Movimientos Validation
 *
 * Zod schemas for movimientos filters.
 *
 * @see MOV-001
 */

import { z } from 'zod';

// =============================================================================
// Filter Schema
// =============================================================================

export const movimientosFilterSchema = z.object({
  fondoId: z.string().uuid().optional(),
  concepto: z.string().optional(),
  estado: z.enum(['borrador', 'confirmado', 'cancelado']).optional(),
  fechaDesde: z.string().optional(),
  fechaHasta: z.string().optional(),
});

export type MovimientosFilter = z.infer<typeof movimientosFilterSchema>;

// =============================================================================
// Concepto Labels (for display)
// =============================================================================

export const CONCEPTO_LABELS: Record<string, string> = {
  APO: 'Aportación',
  'APO-D': 'Aportación Destiempo',
  DIS: 'Distribución',
  DEV: 'Devolución',
  FEE: 'Success Fee',
  INV: 'Inversión',
  'INV-D': 'Desinversión',
  RET: 'Retorno',
  GAS: 'Gasto Admin',
  GASP: 'Gasto Proyecto',
  APS: 'Aportación Socio',
  RPS: 'Retiro Socio',
  PRS: 'Préstamo Socio',
  DPRS: 'Devolución Préstamo',
  TRA: 'Traspaso',
  CAM: 'Cambio Moneda',
  ERR: 'Corrección',
  TSI: 'Ajuste TC',
};

export const ESTADO_LABELS: Record<string, string> = {
  borrador: 'Borrador',
  confirmado: 'Confirmado',
  cancelado: 'Cancelado',
};

// Grouped conceptos for filter dropdown
export const CONCEPTO_GROUPS = {
  Inversionistas: ['APO', 'APO-D', 'DIS', 'DEV', 'FEE'],
  Proyectos: ['INV', 'INV-D', 'RET'],
  Gastos: ['GAS', 'GASP'],
  Socios: ['APS', 'RPS', 'PRS', 'DPRS'],
  Admin: ['TRA', 'CAM', 'ERR', 'TSI'],
};
