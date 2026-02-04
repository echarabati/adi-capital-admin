/**
 * Cuenta Bancaria Validation Schemas
 *
 * Zod schemas for bank account create/update operations.
 *
 * @see FOND-004
 */

import { z } from 'zod';

// =============================================================================
// Constants
// =============================================================================

export const MONEDA_OPTIONS = ['MXN', 'USD', 'EUR', 'ILS'] as const;

// =============================================================================
// Schemas
// =============================================================================

/**
 * Schema for creating a new bank account.
 */
export const createCuentaBancariaSchema = z.object({
  banco: z
    .string()
    .min(2, 'El banco debe tener al menos 2 caracteres')
    .max(100, 'El banco no puede exceder 100 caracteres'),
  numero: z
    .string()
    .min(4, 'El número de cuenta debe tener al menos 4 caracteres')
    .max(30, 'El número no puede exceder 30 caracteres'),
  clabe: z
    .string()
    .length(18, 'La CLABE debe tener exactamente 18 dígitos')
    .regex(/^\d+$/, 'La CLABE debe contener solo dígitos')
    .optional()
    .or(z.literal('')),
  moneda: z.enum(MONEDA_OPTIONS, { message: 'Moneda inválida' }),
});

/**
 * Schema for updating an existing bank account.
 */
export const updateCuentaBancariaSchema = createCuentaBancariaSchema.partial().extend({
  activa: z.boolean().optional(),
});

// =============================================================================
// Types
// =============================================================================

export type CreateCuentaBancariaInput = z.infer<typeof createCuentaBancariaSchema>;
export type UpdateCuentaBancariaInput = z.infer<typeof updateCuentaBancariaSchema>;
