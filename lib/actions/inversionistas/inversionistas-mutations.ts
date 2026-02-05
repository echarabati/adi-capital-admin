'use server';

/**
 * Inversionistas Mutations
 *
 * Server actions for creating and updating inversionistas.
 * Handles N:M relationship with fondos via inversionistasFondos.
 *
 * @see INV-002
 */

import { revalidatePath } from 'next/cache';
import { eq, and, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { inversionistas, inversionistasFondos, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';
import {
  createInversionistaSchema,
  updateInversionistaSchema,
} from '@/lib/validations/inversionistas/inversionista-validation';

// =============================================================================
// Types
// =============================================================================

export type InversionistaMutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Create Inversionista
// =============================================================================

/**
 * Create a new inversionista with fondo assignments.
 *
 * RBAC: User must have access to at least one of the assigned fondos.
 *
 * @param input - Inversionista data with fondoIds
 * @returns Result with success or error
 */
export async function createInversionista(input: unknown): Promise<InversionistaMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Validate input
  const parsed = createInversionistaSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { fondoIds, ...inversionistaData } = parsed.data;

  // 3. RBAC: Check user has access to fondos
  if (!isSuperAdmin(session.user.role)) {
    const userFondosResult = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, session.user.id));

    const userFondoIds = userFondosResult.map((f) => f.fondoId);
    const hasAccess = fondoIds.every((id) => userFondoIds.includes(id));

    if (!hasAccess) {
      return { error: 'No tienes acceso a uno o más fondos seleccionados' };
    }
  }

  // 4. Check email uniqueness (if email provided)
  if (inversionistaData.email) {
    const existingEmail = await db
      .select({ id: inversionistas.id })
      .from(inversionistas)
      .where(eq(inversionistas.email, inversionistaData.email))
      .limit(1);

    if (existingEmail.length > 0) {
      return { error: 'Ya existe un inversionista con ese email' };
    }
  }

  try {
    // 5. Create inversionista in transaction
    const [newInversionista] = await db
      .insert(inversionistas)
      .values({
        nombre: inversionistaData.nombre,
        email: inversionistaData.email,
        telefono: inversionistaData.telefono,
        rfc: inversionistaData.rfc,
        notas: inversionistaData.notas,
        esFundador: inversionistaData.esFundador,
        porcentajePropiedad: inversionistaData.porcentajePropiedad,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: inversionistas.id });

    // 6. Create fondo assignments
    await db.insert(inversionistasFondos).values(
      fondoIds.map((fondoId) => ({
        inversionistaId: newInversionista.id,
        fondoId,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      }))
    );

    // 7. Revalidate cache
    revalidatePath('/inversionistas');

    return { success: true, data: { id: newInversionista.id } };
  } catch (error) {
    console.error('[createInversionista]', error);
    return { error: 'No pudimos crear el inversionista. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Inversionista
// =============================================================================

/**
 * Update an existing inversionista and its fondo assignments.
 *
 * @param id - Inversionista ID
 * @param input - Data to update (including fondoIds for assignment changes)
 * @returns Result with success or error
 */
export async function updateInversionista(
  id: string,
  input: unknown
): Promise<InversionistaMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Validate input - allow fondoIds in update
  const updateWithFondosSchema = updateInversionistaSchema.extend({
    fondoIds: createInversionistaSchema.shape.fondoIds.optional(),
  });

  const parsed = updateWithFondosSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { fondoIds, ...inversionistaData } = parsed.data;

  // 3. Check inversionista exists
  const [existing] = await db
    .select({ id: inversionistas.id, email: inversionistas.email })
    .from(inversionistas)
    .where(eq(inversionistas.id, id))
    .limit(1);

  if (!existing) {
    return { error: 'Inversionista no encontrado' };
  }

  // 4. RBAC: Check user has access (via fondo assignment)
  if (!isSuperAdmin(session.user.role)) {
    const userFondosResult = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, session.user.id));

    const userFondoIds = userFondosResult.map((f) => f.fondoId);

    // Check access to inversionista's current fondos
    const invFondos = await db
      .select({ fondoId: inversionistasFondos.fondoId })
      .from(inversionistasFondos)
      .where(eq(inversionistasFondos.inversionistaId, id));

    const hasAccess = invFondos.some((f) => userFondoIds.includes(f.fondoId));
    if (!hasAccess) {
      return { error: 'No tienes acceso a este inversionista' };
    }

    // If changing fondos, verify access to new fondos
    if (fondoIds) {
      const newFondosAccess = fondoIds.every((fid) => userFondoIds.includes(fid));
      if (!newFondosAccess) {
        return { error: 'No tienes acceso a uno o más fondos seleccionados' };
      }
    }
  }

  // 5. Check email uniqueness (if changed)
  if (inversionistaData.email && inversionistaData.email !== existing.email) {
    const duplicateEmail = await db
      .select({ id: inversionistas.id })
      .from(inversionistas)
      .where(eq(inversionistas.email, inversionistaData.email))
      .limit(1);

    if (duplicateEmail.length > 0) {
      return { error: 'Ya existe un inversionista con ese email' };
    }
  }

  try {
    // 6. Update inversionista
    await db
      .update(inversionistas)
      .set({
        ...inversionistaData,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(inversionistas.id, id));

    // 7. Update fondo assignments (if provided)
    if (fondoIds && fondoIds.length > 0) {
      // Get current assignments
      const currentAssignments = await db
        .select({ fondoId: inversionistasFondos.fondoId })
        .from(inversionistasFondos)
        .where(eq(inversionistasFondos.inversionistaId, id));

      const currentFondoIds = currentAssignments.map((a) => a.fondoId);

      // Determine adds and removes
      const toAdd = fondoIds.filter((fid) => !currentFondoIds.includes(fid));
      const toRemove = currentFondoIds.filter((fid) => !fondoIds.includes(fid));

      // Add new assignments
      if (toAdd.length > 0) {
        await db.insert(inversionistasFondos).values(
          toAdd.map((fondoId) => ({
            inversionistaId: id,
            fondoId,
            createdBy: session.user.id,
            modifiedBy: session.user.id,
          }))
        );
      }

      // Remove old assignments
      if (toRemove.length > 0) {
        await db
          .delete(inversionistasFondos)
          .where(
            and(
              eq(inversionistasFondos.inversionistaId, id),
              inArray(inversionistasFondos.fondoId, toRemove)
            )
          );
      }
    }

    // 8. Revalidate cache
    revalidatePath('/inversionistas');

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateInversionista]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}
