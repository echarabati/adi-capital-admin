'use server';

/**
 * Fondos Mutations
 *
 * Server actions for creating and updating fondos.
 * Only super_admin can perform these actions.
 *
 * @see FOND-002
 */

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { fondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';
import { createFondoSchema, updateFondoSchema } from '@/lib/validations/fondos/fondo-validation';

// =============================================================================
// Types
// =============================================================================

export type FondoMutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Create Fondo
// =============================================================================

/**
 * Create a new fondo.
 *
 * RBAC: Only super_admin can create fondos.
 *
 * @param input - Fondo data
 * @returns Result with success or error
 */
export async function createFondo(input: unknown): Promise<FondoMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. RBAC: Only super_admin
  if (!isSuperAdmin(session.user.role)) {
    return { error: 'Solo Super Admin puede crear fondos' };
  }

  // 3. Validate input
  const parsed = createFondoSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { nombre, monedaBase, metodoCascada, successFeeDefault, prefRateDefault } = parsed.data;

  // 4. Check name uniqueness
  const existingFondo = await db
    .select({ id: fondos.id })
    .from(fondos)
    .where(eq(fondos.nombre, nombre))
    .limit(1);

  if (existingFondo.length > 0) {
    return { error: 'Ya existe un fondo con ese nombre' };
  }

  try {
    // 5. Create fondo
    const [newFondo] = await db
      .insert(fondos)
      .values({
        nombre,
        monedaBase,
        metodoCascada,
        successFeeDefault,
        prefRateDefault,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: fondos.id });

    // 6. Revalidate cache
    revalidatePath('/fondos');

    return { success: true, data: { id: newFondo.id } };
  } catch (error) {
    console.error('[createFondo]', error);
    return { error: 'No pudimos crear el fondo. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Fondo
// =============================================================================

/**
 * Update an existing fondo.
 *
 * RBAC: Only super_admin can update fondos.
 *
 * @param id - Fondo ID
 * @param input - Fondo data to update
 * @returns Result with success or error
 */
export async function updateFondo(id: string, input: unknown): Promise<FondoMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. RBAC: Only super_admin
  if (!isSuperAdmin(session.user.role)) {
    return { error: 'Solo Super Admin puede editar fondos' };
  }

  // 3. Validate input
  const parsed = updateFondoSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  // 4. Check fondo exists
  const [existingFondo] = await db
    .select({ id: fondos.id, nombre: fondos.nombre })
    .from(fondos)
    .where(eq(fondos.id, id))
    .limit(1);

  if (!existingFondo) {
    return { error: 'Fondo no encontrado' };
  }

  // 5. Check name uniqueness (if changed)
  if (parsed.data.nombre && parsed.data.nombre !== existingFondo.nombre) {
    const duplicateName = await db
      .select({ id: fondos.id })
      .from(fondos)
      .where(eq(fondos.nombre, parsed.data.nombre))
      .limit(1);

    if (duplicateName.length > 0) {
      return { error: 'Ya existe un fondo con ese nombre' };
    }
  }

  try {
    // 6. Update fondo
    await db
      .update(fondos)
      .set({
        ...parsed.data,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(fondos.id, id));

    // 7. Revalidate cache
    revalidatePath('/fondos');

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateFondo]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}
