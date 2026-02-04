'use server';

/**
 * Beneficiarios Mutations
 *
 * Server actions for creating and updating beneficiaries.
 * Requires admin_fondo+ role.
 *
 * @see FOND-005
 */

import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { beneficiarios, userFondos } from '@/lib/db/schema';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import {
  createBeneficiarioSchema,
  updateBeneficiarioSchema,
} from '@/lib/validations/beneficiarios/beneficiario-validation';

// =============================================================================
// Types
// =============================================================================

export type BeneficiarioMutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Helpers
// =============================================================================

async function checkFundAccess(
  userId: string,
  userRole: string | undefined,
  fondoId: string
): Promise<boolean> {
  if (isSuperAdmin(userRole ?? '')) return true;
  if (!hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO)) return false;

  const [access] = await db
    .select({ fondoId: userFondos.fondoId })
    .from(userFondos)
    .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, fondoId)))
    .limit(1);

  return !!access;
}

// =============================================================================
// Create Beneficiario
// =============================================================================

/**
 * Create a new beneficiary for a fund.
 *
 * RBAC: admin_fondo+ with fund access
 * BR-019: nombre único dentro del fondo
 */
export async function createBeneficiario(
  fondoId: string,
  input: unknown
): Promise<BeneficiarioMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para crear beneficiarios en este fondo' };
  }

  // 3. Validate input
  const parsed = createBeneficiarioSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { nombre, banco, numeroCuenta, clabe, notas } = parsed.data;

  // 4. BR-019: Check unique name within fund
  const [existing] = await db
    .select({ id: beneficiarios.id })
    .from(beneficiarios)
    .where(and(eq(beneficiarios.fondoId, fondoId), eq(beneficiarios.nombre, nombre)))
    .limit(1);

  if (existing) {
    return { error: 'Ya existe un beneficiario con ese nombre en este fondo' };
  }

  try {
    // 5. Create beneficiary
    const [newBeneficiario] = await db
      .insert(beneficiarios)
      .values({
        fondoId,
        nombre,
        banco: banco || null,
        numeroCuenta: numeroCuenta || null,
        clabe: clabe || null,
        notas: notas || null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: beneficiarios.id });

    // 6. Revalidate cache
    revalidatePath(`/fondos/${fondoId}/beneficiarios`);

    return { success: true, data: { id: newBeneficiario.id } };
  } catch (error) {
    console.error('[createBeneficiario]', error);
    return { error: 'No pudimos crear el beneficiario. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Beneficiario
// =============================================================================

/**
 * Update an existing beneficiary.
 *
 * RBAC: admin_fondo+ with fund access
 * BR-019: nombre único dentro del fondo
 */
export async function updateBeneficiario(
  id: string,
  input: unknown
): Promise<BeneficiarioMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Get existing
  const [existing] = await db
    .select({
      id: beneficiarios.id,
      fondoId: beneficiarios.fondoId,
      nombre: beneficiarios.nombre,
    })
    .from(beneficiarios)
    .where(eq(beneficiarios.id, id))
    .limit(1);

  if (!existing) {
    return { error: 'Beneficiario no encontrado' };
  }

  // 3. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, existing.fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para editar este beneficiario' };
  }

  // 4. Validate input
  const parsed = updateBeneficiarioSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  // 5. BR-019: Check unique name if changed
  if (parsed.data.nombre && parsed.data.nombre !== existing.nombre) {
    const [duplicate] = await db
      .select({ id: beneficiarios.id })
      .from(beneficiarios)
      .where(
        and(
          eq(beneficiarios.fondoId, existing.fondoId),
          eq(beneficiarios.nombre, parsed.data.nombre)
        )
      )
      .limit(1);

    if (duplicate) {
      return { error: 'Ya existe un beneficiario con ese nombre en este fondo' };
    }
  }

  try {
    // 6. Update
    await db
      .update(beneficiarios)
      .set({
        ...parsed.data,
        banco: parsed.data.banco || null,
        numeroCuenta: parsed.data.numeroCuenta || null,
        clabe: parsed.data.clabe || null,
        notas: parsed.data.notas || null,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(beneficiarios.id, id));

    // 7. Revalidate cache
    revalidatePath(`/fondos/${existing.fondoId}/beneficiarios`);

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateBeneficiario]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}
