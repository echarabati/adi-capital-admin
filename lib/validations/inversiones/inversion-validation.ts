/**
 * Inversion Validation Schema
 *
 * Zod schemas for creating and updating inversiones.
 *
 * @see INVE-002
 */

import { z } from 'zod';

// =============================================================================
// Constants
// =============================================================================

export const TIPO_ADMIN_FEE_OPTIONS = ['one_time', 'anual'] as const;
export const BASE_ADMIN_FEE_OPTIONS = ['compromiso', 'aportado'] as const;
export const METODO_ADMIN_FEE_OPTIONS = [
  'capital_call_independiente',
  'incluido_en_capital_call',
] as const;

// =============================================================================
// Create Schema
// =============================================================================

export const createInversionSchema = z.object({
  /** Investor UUID */
  inversionistaId: z.string().uuid('Selecciona un inversionista'),

  /** Committed capital amount */
  compromiso: z
    .string()
    .min(1, 'El compromiso es requerido')
    .refine((val) => !isNaN(parseFloat(val)) && parseFloat(val) > 0, {
      message: 'El compromiso debe ser mayor a 0',
    }),

  /** Preferred return rate override (optional) */
  prefRate: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'La tasa Pref debe ser un número válido',
    }),

  /** Success fee override (optional) */
  successFeePct: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'El Success Fee debe ser un número válido',
    }),

  // Admin Fee Configuration
  adminFeeTipo: z.enum(TIPO_ADMIN_FEE_OPTIONS).nullable().optional(),
  adminFeePct: z
    .string()
    .optional()
    .refine((val) => !val || (!isNaN(parseFloat(val)) && parseFloat(val) >= 0), {
      message: 'El porcentaje debe ser un número válido',
    }),
  adminFeeBase: z.enum(BASE_ADMIN_FEE_OPTIONS).nullable().optional(),
  adminFeeMetodo: z.enum(METODO_ADMIN_FEE_OPTIONS).nullable().optional(),

  /** Notes (optional) */
  notas: z.string().max(500, 'Máximo 500 caracteres').optional(),
});

export type CreateInversionInput = z.infer<typeof createInversionSchema>;
