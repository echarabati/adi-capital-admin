/**
 * Calendario Pagos Validation
 *
 * Zod schemas for capital call forms.
 *
 * @see INVE-005
 */

import { z } from 'zod';

/**
 * Form input schema for creating/editing capital calls.
 */
export const calendarioPagoFormSchema = z.object({
  fechaProgramada: z.string().min(1, 'La fecha programada es requerida'),
  montoEsperado: z
    .string()
    .min(1, 'El monto esperado es requerido')
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'El monto debe ser un número positivo' }
    ),
  notas: z.string().max(500, 'Máximo 500 caracteres').optional().nullable(),
});

export type CalendarioPagoFormInput = z.infer<typeof calendarioPagoFormSchema>;

/**
 * Schema for registering a payment to a capital call.
 */
export const registrarPagoSchema = z.object({
  monto: z
    .string()
    .min(1, 'El monto es requerido')
    .refine(
      (val) => {
        const num = Number(val);
        return !isNaN(num) && num > 0;
      },
      { message: 'El monto debe ser un número positivo' }
    ),
  generarApo: z.boolean().default(false),
});

export type RegistrarPagoInput = z.infer<typeof registrarPagoSchema>;
