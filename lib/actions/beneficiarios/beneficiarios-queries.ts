'use server';

/**
 * Beneficiarios Queries
 *
 * Server-side queries for beneficiaries with RBAC filtering.
 *
 * @see FOND-005
 */

import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { beneficiarios, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type BeneficiarioListItem = {
  id: string;
  nombre: string;
  banco: string | null;
  numeroCuenta: string | null;
  clabe: string | null;
  notas: string | null;
};

// =============================================================================
// Get Beneficiarios by Fondo
// =============================================================================

/**
 * Get all beneficiaries for a fund.
 *
 * RBAC:
 * - super_admin: Any fund
 * - admin_fondo/agente: Only assigned funds
 */
export async function getBeneficiariosByFondo(fondoId: string): Promise<BeneficiarioListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Check fund access for non-super_admin
  if (!isSuperAdmin(userRole)) {
    const [access] = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, fondoId)))
      .limit(1);

    if (!access) {
      throw new Error('No tienes acceso a este fondo');
    }
  }

  // Fetch beneficiaries
  const result = await db
    .select({
      id: beneficiarios.id,
      nombre: beneficiarios.nombre,
      banco: beneficiarios.banco,
      numeroCuenta: beneficiarios.numeroCuenta,
      clabe: beneficiarios.clabe,
      notas: beneficiarios.notas,
    })
    .from(beneficiarios)
    .where(eq(beneficiarios.fondoId, fondoId))
    .orderBy(beneficiarios.nombre);

  return result;
}
