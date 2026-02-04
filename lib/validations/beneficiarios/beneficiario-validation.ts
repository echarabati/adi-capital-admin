/**
 * Beneficiario Validation Schemas
 *
 * Zod schemas for beneficiary create/update operations.
 *
 * @see FOND-005
 */

import { z } from 'zod';

// =============================================================================
// Schemas
// =============================================================================

/**
 * Schema for creating a new beneficiary.
 */
export const createBeneficiarioSchema = z.object({
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(150, 'El nombre no puede exceder 150 caracteres'),
  banco: z
    .string()
    .max(100, 'El banco no puede exceder 100 caracteres')
    .optional()
    .or(z.literal('')),
  numeroCuenta: z
    .string()
    .max(30, 'El número de cuenta no puede exceder 30 caracteres')
    .optional()
    .or(z.literal('')),
  clabe: z
    .string()
    .length(18, 'La CLABE debe tener exactamente 18 dígitos')
    .regex(/^\d+$/, 'La CLABE debe contener solo dígitos')
    .optional()
    .or(z.literal('')),
  notas: z
    .string()
    .max(500, 'Las notas no pueden exceder 500 caracteres')
    .optional()
    .or(z.literal('')),
});

/**
 * Schema for updating an existing beneficiary.
 */
export const updateBeneficiarioSchema = createBeneficiarioSchema.partial();

// =============================================================================
// Types
// =============================================================================

export type CreateBeneficiarioInput = z.infer<typeof createBeneficiarioSchema>;
export type UpdateBeneficiarioInput = z.infer<typeof updateBeneficiarioSchema>;
