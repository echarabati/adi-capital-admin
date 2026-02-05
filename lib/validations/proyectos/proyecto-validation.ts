/**
 * Proyecto Validation Schemas
 *
 * Zod schemas for project create/update operations.
 *
 * @see PROJ-002
 */

import { z } from 'zod';

// =============================================================================
// Constants
// =============================================================================

export const METODO_CASCADA_OPTIONS = ['pref_primero', 'capital_primero'] as const;
export const ESTADO_PROYECTO_OPTIONS = [
  'inversion_abierta',
  'inversion_cerrada',
  'concluido',
] as const;

// =============================================================================
// Schemas
// =============================================================================

/**
 * Schema for creating a new project.
 */
export const createProyectoSchema = z.object({
  codigo: z
    .string()
    .min(1, 'El código es requerido')
    .max(50, 'El código no puede exceder 50 caracteres'),
  nombre: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(200, 'El nombre no puede exceder 200 caracteres'),
  descripcion: z
    .string()
    .max(1000, 'La descripción no puede exceder 1000 caracteres')
    .optional()
    .or(z.literal('')),
  tasaPref: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Ingresa un porcentaje válido')
    .optional()
    .default('12.00'),
  successFeePct: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, 'Ingresa un porcentaje válido')
    .optional()
    .or(z.literal('')),
  metodoCascada: z.enum(METODO_CASCADA_OPTIONS).optional().nullable(),
  fechaInicio: z.string().optional().or(z.literal('')),
  fechaTerminacion: z.string().optional().or(z.literal('')),
});

/**
 * Schema for updating an existing project.
 */
export const updateProyectoSchema = createProyectoSchema.partial().extend({
  estado: z.enum(ESTADO_PROYECTO_OPTIONS).optional(),
});

// =============================================================================
// Types
// =============================================================================

export type CreateProyectoInput = z.infer<typeof createProyectoSchema>;
export type UpdateProyectoInput = z.infer<typeof updateProyectoSchema>;
