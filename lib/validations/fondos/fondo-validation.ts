/**
 * Fondo Validation Schemas
 *
 * Zod schemas for fondo create/update operations.
 *
 * @see FOND-002
 */

import { z } from 'zod';

// =============================================================================
// Constants
// =============================================================================

export const MONEDA_OPTIONS = ['MXN', 'USD', 'EUR', 'ILS'] as const;
export const METODO_CASCADA_OPTIONS = ['pref_primero', 'capital_primero'] as const;

// =============================================================================
// Schemas
// =============================================================================

/**
 * Schema for creating a new fondo.
 */
export const createFondoSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  monedaBase: z.enum(MONEDA_OPTIONS, { message: 'Moneda inválida' }),
  metodoCascada: z.enum(METODO_CASCADA_OPTIONS, { message: 'Método de cascada inválido' }),
  successFeeDefault: z.string().optional().default('20'),
  prefRateDefault: z.string().optional().default('12'),
});

/**
 * Schema for updating an existing fondo.
 */
export const updateFondoSchema = createFondoSchema.partial().extend({
  activo: z.boolean().optional(),
});

// =============================================================================
// Types
// =============================================================================

export type CreateFondoInput = z.infer<typeof createFondoSchema>;
export type UpdateFondoInput = z.infer<typeof updateFondoSchema>;
