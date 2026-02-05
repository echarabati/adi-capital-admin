'use server';

/**
 * Calendario Pagos Mutations
 *
 * Server actions for creating and updating capital calls.
 *
 * @see INVE-005
 */

import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { calendarioPagos } from '@/lib/db/schema';
import { revalidatePath } from 'next/cache';
import {
  calendarioPagoFormSchema,
  type CalendarioPagoFormInput,
} from '@/lib/validations/calendario-pagos/calendario-pagos-validation';
import { getNextCalendarioNumero } from './calendario-pagos-queries';

// =============================================================================
// Create Capital Call
// =============================================================================

/**
 * Create a new capital call for an investment.
 *
 * @param inversionId - Investment UUID
 * @param input - Capital call data
 * @returns Created capital call
 */
export async function createCalendarioPago(inversionId: string, input: CalendarioPagoFormInput) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Debes iniciar sesión' };
  }

  // Validate input
  const parsed = calendarioPagoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Datos inválidos', details: parsed.error.flatten() };
  }

  try {
    // Get next numero
    const numero = await getNextCalendarioNumero(inversionId);

    // Parse date string to Date
    const fechaProgramada = new Date(parsed.data.fechaProgramada);

    const [created] = await db
      .insert(calendarioPagos)
      .values({
        inversionId,
        numero,
        fechaProgramada,
        montoEsperado: parsed.data.montoEsperado,
        notas: parsed.data.notas ?? null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning();

    revalidatePath(`/inversiones/${inversionId}/calendario`);

    return { success: true, data: created };
  } catch (error) {
    console.error('[createCalendarioPago]', error);
    return { error: 'No pudimos crear el capital call. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Capital Call
// =============================================================================

/**
 * Update an existing capital call.
 *
 * @param id - Capital call UUID
 * @param inversionId - Investment UUID (for revalidation)
 * @param input - Updated data
 * @returns Updated capital call
 */
export async function updateCalendarioPago(
  id: string,
  inversionId: string,
  input: CalendarioPagoFormInput
) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Debes iniciar sesión' };
  }

  // Validate input
  const parsed = calendarioPagoFormSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Datos inválidos', details: parsed.error.flatten() };
  }

  try {
    // Parse date string to Date
    const fechaProgramada = new Date(parsed.data.fechaProgramada);

    const [updated] = await db
      .update(calendarioPagos)
      .set({
        fechaProgramada,
        montoEsperado: parsed.data.montoEsperado,
        notas: parsed.data.notas ?? null,
        modifiedBy: session.user.id,
      })
      .where(eq(calendarioPagos.id, id))
      .returning();

    if (!updated) {
      return { error: 'Capital call no encontrado' };
    }

    revalidatePath(`/inversiones/${inversionId}/calendario`);

    return { success: true, data: updated };
  } catch (error) {
    console.error('[updateCalendarioPago]', error);
    return { error: 'No pudimos actualizar el capital call. Intenta de nuevo.' };
  }
}

// =============================================================================
// Registrar Pago de Capital Call
// =============================================================================

/**
 * Register a payment for a capital call.
 *
 * Updates monto_pagado and estado based on payment.
 * Optionally generates an APO movement in draft status.
 *
 * @param id - Capital call UUID
 * @param inversionId - Investment UUID (for revalidation and APO)
 * @param inversionistaId - Investor UUID (for APO generation)
 * @param input - Payment data
 * @returns Updated capital call
 *
 * @see INVE-006
 */
export async function registrarPagoCapitalCall(
  id: string,
  inversionId: string,
  inversionistaId: string,
  input: { monto: string; generarApo: boolean }
) {
  const session = await auth();
  if (!session?.user) {
    return { error: 'Debes iniciar sesión' };
  }

  const montoNum = Number(input.monto) || 0;
  if (montoNum <= 0) {
    return { error: 'El monto debe ser mayor a 0' };
  }

  try {
    // Get current capital call
    const [current] = await db
      .select({
        montoEsperado: calendarioPagos.montoEsperado,
        montoPagado: calendarioPagos.montoPagado,
      })
      .from(calendarioPagos)
      .where(eq(calendarioPagos.id, id));

    if (!current) {
      return { error: 'Capital call no encontrado' };
    }

    const esperado = Number(current.montoEsperado) || 0;
    const pagadoActual = Number(current.montoPagado) || 0;
    const saldoPendiente = esperado - pagadoActual;

    // Validate monto doesn't exceed pending balance
    if (montoNum > saldoPendiente) {
      return {
        error: `Monto excede saldo pendiente. Máximo: $${saldoPendiente.toLocaleString()}`,
      };
    }

    // Calculate new totals
    const nuevoMontoPagado = pagadoActual + montoNum;
    const nuevoEstado: 'pendiente' | 'parcial' | 'completo' =
      nuevoMontoPagado >= esperado ? 'completo' : nuevoMontoPagado > 0 ? 'parcial' : 'pendiente';

    // Update capital call
    const [updated] = await db
      .update(calendarioPagos)
      .set({
        montoPagado: nuevoMontoPagado.toString(),
        estado: nuevoEstado,
        modifiedBy: session.user.id,
      })
      .where(eq(calendarioPagos.id, id))
      .returning();

    // Optionally generate APO movement (draft)
    if (input.generarApo) {
      // Import schemas dynamically to avoid circular deps
      const { movimientos, inversiones, proyectos } = await import('@/lib/db/schema');

      // Fetch investment to get proyecto
      const [inversion] = await db
        .select({
          proyectoId: inversiones.proyectoId,
        })
        .from(inversiones)
        .where(eq(inversiones.id, inversionId));

      if (inversion) {
        // Fetch project to get fondoId
        const [proyecto] = await db
          .select({ fondoId: proyectos.fondoId })
          .from(proyectos)
          .where(eq(proyectos.id, inversion.proyectoId));

        if (proyecto) {
          await db.insert(movimientos).values({
            fondoId: proyecto.fondoId,
            inversionistaId,
            inversionId,
            proyectoId: inversion.proyectoId,
            concepto: 'APO',
            monto: input.monto,
            moneda: 'MXN',
            estado: 'borrador',
            fechaMovimiento: new Date(),
            descripcion: `Pago capital call #${id.slice(0, 8)}`,
            createdBy: session.user.id,
            modifiedBy: session.user.id,
          });
        }
      }
    }

    revalidatePath(`/inversiones/${inversionId}/calendario`);
    revalidatePath(`/inversiones/${inversionId}/movimientos`);

    return { success: true, data: updated };
  } catch (error) {
    console.error('[registrarPagoCapitalCall]', error);
    return { error: 'No pudimos registrar el pago. Intenta de nuevo.' };
  }
}
