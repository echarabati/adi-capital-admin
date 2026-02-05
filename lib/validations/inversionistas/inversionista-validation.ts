/**
 * Inversionista Validation Schemas
 *
 * Zod schemas for inversionista data validation.
 *
 * @see INV-001
 */

import { z } from 'zod';

// =============================================================================
// Base Schema (derived from DB schema)
// =============================================================================

export const inversionistaSchema = z.object({
  nombre: z.string().min(1, 'El nombre es requerido').max(200),
  email: z.string().email('Email inválido').optional().nullable(),
  telefono: z.string().max(20).optional().nullable(),
  rfc: z.string().max(13).optional().nullable(),
  notas: z.string().optional().nullable(),
  esFundador: z.boolean().default(false),
  porcentajePropiedad: z
    .string()
    .optional()
    .nullable()
    .refine(
      (val) => {
        if (!val) return true;
        const num = parseFloat(val);
        return !isNaN(num) && num >= 0 && num <= 100;
      },
      { message: 'El porcentaje debe estar entre 0 y 100' }
    ),
});

// =============================================================================
// Create/Update Schemas
// =============================================================================

export const createInversionistaSchema = inversionistaSchema.extend({
  fondoIds: z.array(z.string().uuid()).min(1, 'Debe asignar al menos un fondo'),
});

export const updateInversionistaSchema = inversionistaSchema.partial();

// =============================================================================
// Filter Schema
// =============================================================================

export const inversionistaFilterSchema = z.object({
  fondoId: z.string().uuid().optional(),
  search: z.string().optional(),
});

// =============================================================================
// Types
// =============================================================================

export type InversionistaInput = z.infer<typeof inversionistaSchema>;
export type CreateInversionistaInput = z.infer<typeof createInversionistaSchema>;
export type UpdateInversionistaInput = z.infer<typeof updateInversionistaSchema>;
export type InversionistaFilter = z.infer<typeof inversionistaFilterSchema>;
