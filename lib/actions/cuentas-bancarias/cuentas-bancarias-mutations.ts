'use server';

/**
 * Cuentas Bancarias Mutations
 *
 * Server actions for creating and updating bank accounts.
 * Requires admin_fondo+ role.
 *
 * @see FOND-004
 */

import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { cuentasBancarias, userFondos } from '@/lib/db/schema';
import {
  createCuentaBancariaSchema,
  updateCuentaBancariaSchema,
} from '@/lib/validations/cuentas-bancarias/cuenta-bancaria-validation';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type CuentaMutationResult = {
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
// Create Cuenta Bancaria
// =============================================================================

/**
 * Create a new bank account for a fund.
 *
 * RBAC: admin_fondo+ with fund access
 *
 * @param fondoId - Fund UUID
 * @param input - Account data
 * @returns Result with success or error
 */
export async function createCuentaBancaria(
  fondoId: string,
  input: unknown
): Promise<CuentaMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para crear cuentas en este fondo' };
  }

  // 3. Validate input
  const parsed = createCuentaBancariaSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const { banco, numero, clabe, moneda } = parsed.data;

  // 4. Check uniqueness (same fund + account number)
  const [existing] = await db
    .select({ id: cuentasBancarias.id })
    .from(cuentasBancarias)
    .where(and(eq(cuentasBancarias.fondoId, fondoId), eq(cuentasBancarias.numero, numero)))
    .limit(1);

  if (existing) {
    return { error: 'Ya existe una cuenta con ese número en este fondo' };
  }

  try {
    // 5. Create account
    const [newCuenta] = await db
      .insert(cuentasBancarias)
      .values({
        fondoId,
        banco,
        numero,
        clabe: clabe || null,
        moneda,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: cuentasBancarias.id });

    // 6. Revalidate cache
    revalidatePath(`/fondos/${fondoId}/cuentas`);

    return { success: true, data: { id: newCuenta.id } };
  } catch (error) {
    console.error('[createCuentaBancaria]', error);
    return { error: 'No pudimos crear la cuenta. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Cuenta Bancaria
// =============================================================================

/**
 * Update an existing bank account.
 *
 * RBAC: admin_fondo+ with fund access
 *
 * @param id - Account UUID
 * @param input - Account data to update
 * @returns Result with success or error
 */
export async function updateCuentaBancaria(
  id: string,
  input: unknown
): Promise<CuentaMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Get existing account
  const [existing] = await db
    .select({
      id: cuentasBancarias.id,
      fondoId: cuentasBancarias.fondoId,
      numero: cuentasBancarias.numero,
    })
    .from(cuentasBancarias)
    .where(eq(cuentasBancarias.id, id))
    .limit(1);

  if (!existing) {
    return { error: 'Cuenta no encontrada' };
  }

  // 3. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, existing.fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para editar esta cuenta' };
  }

  // 4. Validate input
  const parsed = updateCuentaBancariaSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  // 5. Check uniqueness if numero changed
  if (parsed.data.numero && parsed.data.numero !== existing.numero) {
    const [duplicate] = await db
      .select({ id: cuentasBancarias.id })
      .from(cuentasBancarias)
      .where(
        and(
          eq(cuentasBancarias.fondoId, existing.fondoId),
          eq(cuentasBancarias.numero, parsed.data.numero)
        )
      )
      .limit(1);

    if (duplicate) {
      return { error: 'Ya existe una cuenta con ese número en este fondo' };
    }
  }

  try {
    // 6. Update account
    await db
      .update(cuentasBancarias)
      .set({
        ...parsed.data,
        clabe: parsed.data.clabe || null,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(cuentasBancarias.id, id));

    // 7. Revalidate cache
    revalidatePath(`/fondos/${existing.fondoId}/cuentas`);

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateCuentaBancaria]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}
