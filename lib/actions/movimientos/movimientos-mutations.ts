'use server';

/**
 * Movimientos Mutations
 *
 * Server actions for creating and updating movimientos.
 *
 * @see MOV-002, MOV-007
 */

import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { movimientos, fondos, userFondos, inversionistas } from '@/lib/db/schema';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import {
  createMovimientoSchema,
  CreateMovimientoInput,
  isSociosConcepto,
} from '@/lib/validations/movimientos/movimientos-validation';

// =============================================================================
// Types
// =============================================================================

type MutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Create Movimiento
// =============================================================================

/**
 * Create a new movimiento (financial movement).
 *
 * Creates in 'borrador' (draft) state.
 * Calculates monto_usd if tipoCambio is provided.
 *
 * @param input - Form data
 * @returns Success/error result
 */
export async function createMovimiento(input: CreateMovimientoInput): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  const userRole = session.user.role;

  // Check permissions
  if (!isSuperAdmin(userRole) && !hasRoleOrHigher(userRole, ROLES.ADMIN_FONDO)) {
    return { error: 'No tienes permiso para crear movimientos' };
  }

  // Validate input
  const parsed = createMovimientoSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError = Object.values(errors.fieldErrors)[0]?.[0] || 'Datos inválidos';
    return { error: firstError };
  }

  const data = parsed.data;

  try {
    // Verify fondo exists
    const [fondo] = await db
      .select({ id: fondos.id, monedaBase: fondos.monedaBase })
      .from(fondos)
      .where(eq(fondos.id, data.fondoId))
      .limit(1);

    if (!fondo) {
      return { error: 'Fondo no encontrado' };
    }

    // Validate Socios conceptos require founder (BR-012, MOV-009)
    if (isSociosConcepto(data.concepto)) {
      if (!data.inversionistaId) {
        return { error: 'Debes seleccionar un fundador para este tipo de movimiento' };
      }

      // Verify inversionista is a founder
      const [inversionista] = await db
        .select({ id: inversionistas.id, esFundador: inversionistas.esFundador })
        .from(inversionistas)
        .where(eq(inversionistas.id, data.inversionistaId))
        .limit(1);

      if (!inversionista) {
        return { error: 'Inversionista no encontrado' };
      }

      if (!inversionista.esFundador) {
        return { error: 'Solo fundadores pueden recibir este tipo de movimiento' };
      }
    }

    // Calculate monto_usd if different currency and tipoCambio provided
    let montoUsd: string | null = null;
    const monto = parseFloat(data.monto);

    if (data.moneda === 'USD') {
      montoUsd = data.monto;
    } else if (data.tipoCambio) {
      const tc = parseFloat(data.tipoCambio);
      if (tc > 0) {
        montoUsd = (monto / tc).toFixed(2);
      }
    }

    // Insert movimiento
    const [newMovimiento] = await db
      .insert(movimientos)
      .values({
        fondoId: data.fondoId,
        concepto: data.concepto,
        monto: data.monto,
        moneda: data.moneda,
        tipoCambio: data.tipoCambio || null,
        montoUsd,
        estado: 'borrador',
        fechaMovimiento: new Date(data.fechaMovimiento),
        descripcion: data.descripcion || null,
        proyectoId: data.proyectoId || null,
        inversionistaId: data.inversionistaId || null,
        inversionId: data.inversionId || null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: movimientos.id });

    // Revalidate paths
    revalidatePath('/movimientos', 'page');

    return { success: true, data: { id: newMovimiento.id } };
  } catch (error) {
    console.error('[createMovimiento]', error);
    return { error: 'No pudimos crear el movimiento. Intenta de nuevo.' };
  }
}

// =============================================================================
// Confirm Movimiento
// =============================================================================

/**
 * Confirm a draft movimiento.
 *
 * Transitions estado: borrador → confirmado
 * Once confirmed, movimiento is immutable (BR-023).
 *
 * @param id - Movimiento UUID
 * @returns Success/error result
 */
export async function confirmMovimiento(id: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Check permissions
  if (!isSuperAdmin(userRole) && !hasRoleOrHigher(userRole, ROLES.ADMIN_FONDO)) {
    return { error: 'No tienes permiso para confirmar movimientos' };
  }

  try {
    // Fetch movimiento
    const [mov] = await db
      .select({
        id: movimientos.id,
        fondoId: movimientos.fondoId,
        estado: movimientos.estado,
      })
      .from(movimientos)
      .where(eq(movimientos.id, id))
      .limit(1);

    if (!mov) {
      return { error: 'Movimiento no encontrado' };
    }

    // Check fund access for non-super_admin
    if (!isSuperAdmin(userRole)) {
      const [access] = await db
        .select({ fondoId: userFondos.fondoId })
        .from(userFondos)
        .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, mov.fondoId)))
        .limit(1);

      if (!access) {
        return { error: 'No tienes acceso a este fondo' };
      }
    }

    // Check estado is borrador (BR-023)
    if (mov.estado !== 'borrador') {
      return { error: 'Solo se pueden confirmar movimientos en borrador' };
    }

    // Update estado
    await db
      .update(movimientos)
      .set({
        estado: 'confirmado',
        fechaConfirmacion: new Date(),
        modifiedBy: userId,
      })
      .where(eq(movimientos.id, id));

    revalidatePath('/movimientos', 'page');

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[confirmMovimiento]', error);
    return { error: 'No pudimos confirmar el movimiento. Intenta de nuevo.' };
  }
}

// =============================================================================
// Cancel Movimiento
// =============================================================================

/**
 * Cancel a confirmed movimiento.
 *
 * Transitions estado: confirmado → cancelado
 * Once cancelled, movimiento is immutable (BR-023).
 *
 * @param id - Movimiento UUID
 * @returns Success/error result
 */
export async function cancelMovimiento(id: string): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Check permissions
  if (!isSuperAdmin(userRole) && !hasRoleOrHigher(userRole, ROLES.ADMIN_FONDO)) {
    return { error: 'No tienes permiso para cancelar movimientos' };
  }

  try {
    // Fetch movimiento
    const [mov] = await db
      .select({
        id: movimientos.id,
        fondoId: movimientos.fondoId,
        estado: movimientos.estado,
      })
      .from(movimientos)
      .where(eq(movimientos.id, id))
      .limit(1);

    if (!mov) {
      return { error: 'Movimiento no encontrado' };
    }

    // Check fund access for non-super_admin
    if (!isSuperAdmin(userRole)) {
      const [access] = await db
        .select({ fondoId: userFondos.fondoId })
        .from(userFondos)
        .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, mov.fondoId)))
        .limit(1);

      if (!access) {
        return { error: 'No tienes acceso a este fondo' };
      }
    }

    // Check estado is confirmado (BR-023)
    if (mov.estado !== 'confirmado') {
      return { error: 'Solo se pueden cancelar movimientos confirmados' };
    }

    // Update estado
    await db
      .update(movimientos)
      .set({
        estado: 'cancelado',
        modifiedBy: userId,
      })
      .where(eq(movimientos.id, id));

    revalidatePath('/movimientos', 'page');

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[cancelMovimiento]', error);
    return { error: 'No pudimos cancelar el movimiento. Intenta de nuevo.' };
  }
}
