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
} as const;

// All conceptos as array
export const CONCEPTOS = [
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
  'TRA',
  'CAM',
  'ERR',
  'TSI',
] as const;

export type Concepto = (typeof CONCEPTOS)[number];

// =============================================================================
// Create Movimiento Schema
// =============================================================================

export const createMovimientoSchema = z.object({
  fondoId: z.string().uuid({ message: 'Fondo es requerido' }),
  concepto: z.enum(CONCEPTOS, { message: 'Concepto es requerido' }),
  monto: z
    .string()
    .min(1, 'Monto es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'Monto debe ser mayor a 0',
    }),
  moneda: z.enum(['USD', 'MXN'], { message: 'Moneda es requerida' }),
  tipoCambio: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) > 0), {
      message: 'Tipo de cambio debe ser mayor a 0',
    }),
  fechaMovimiento: z.string().min(1, 'Fecha es requerida'),
  descripcion: z.string().optional(),
  // Optional references
  proyectoId: z.string().uuid().optional().nullable(),
  inversionistaId: z.string().uuid().optional().nullable(),
  inversionId: z.string().uuid().optional().nullable(),
});

export type CreateMovimientoInput = z.infer<typeof createMovimientoSchema>;

// =============================================================================
// Concepto Configuration (requires reference fields)
// =============================================================================

type ConceptoConfig = {
  label: string;
  category: string;
  requiresInversionista: boolean;
  requiresProyecto: boolean;
  requiresInversion: boolean;
  color: string;
};

export const CONCEPTO_CONFIG: Record<Concepto, ConceptoConfig> = {
  APO: {
    label: 'Aportación',
    category: 'Inversionistas',
    requiresInversionista: true,
    requiresProyecto: false,
    requiresInversion: true,
    color: 'emerald',
  },
  'APO-D': {
    label: 'Aportación Destiempo',
    category: 'Inversionistas',
    requiresInversionista: true,
    requiresProyecto: false,
    requiresInversion: true,
    color: 'emerald',
  },
  DIS: {
    label: 'Distribución',
    category: 'Inversionistas',
    requiresInversionista: true,
    requiresProyecto: false,
    requiresInversion: true,
    color: 'rose',
  },
  DEV: {
    label: 'Devolución',
    category: 'Inversionistas',
    requiresInversionista: true,
    requiresProyecto: false,
    requiresInversion: true,
    color: 'rose',
  },
  FEE: {
    label: 'Success Fee',
    category: 'Inversionistas',
    requiresInversionista: true,
    requiresProyecto: false,
    requiresInversion: true,
    color: 'rose',
  },
  INV: {
    label: 'Inversión',
    category: 'Proyectos',
    requiresInversionista: false,
    requiresProyecto: true,
    requiresInversion: false,
    color: 'blue',
  },
  'INV-D': {
    label: 'Desinversión',
    category: 'Proyectos',
    requiresInversionista: false,
    requiresProyecto: true,
    requiresInversion: false,
    color: 'purple',
  },
  RET: {
    label: 'Retorno',
    category: 'Proyectos',
    requiresInversionista: false,
    requiresProyecto: true,
    requiresInversion: false,
    color: 'emerald',
  },
  GAS: {
    label: 'Gasto Admin',
    category: 'Gastos',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'amber',
  },
  GASP: {
    label: 'Gasto Proyecto',
    category: 'Gastos',
    requiresInversionista: false,
    requiresProyecto: true,
    requiresInversion: false,
    color: 'amber',
  },
  APS: {
    label: 'Aportación Socio',
    category: 'Socios',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'cyan',
  },
  RPS: {
    label: 'Retiro Socio',
    category: 'Socios',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'cyan',
  },
  PRS: {
    label: 'Préstamo Socio',
    category: 'Socios',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'cyan',
  },
  DPRS: {
    label: 'Devolución Préstamo',
    category: 'Socios',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'cyan',
  },
  TRA: {
    label: 'Traspaso',
    category: 'Admin',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'gray',
  },
  CAM: {
    label: 'Cambio Moneda',
    category: 'Admin',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'gray',
  },
  ERR: {
    label: 'Corrección',
    category: 'Admin',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'gray',
  },
  TSI: {
    label: 'Ajuste TC',
    category: 'Admin',
    requiresInversionista: false,
    requiresProyecto: false,
    requiresInversion: false,
    color: 'gray',
  },
};
