'use server';

/**
 * Cuentas Bancarias Queries
 *
 * Server-side queries for bank accounts with RBAC filtering.
 *
 * @see FOND-004
 */

import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { cuentasBancarias, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type CuentaBancariaListItem = {
  id: string;
  banco: string;
  numero: string;
  clabe: string | null;
  moneda: string;
  saldo: string;
  activa: boolean;
};

// =============================================================================
// Get Cuentas by Fondo
// =============================================================================

/**
 * Get all bank accounts for a fund.
 *
 * RBAC:
 * - super_admin: Any fund
 * - admin_fondo/agente: Only assigned funds
 *
 * @param fondoId - Fund UUID
 * @returns List of bank accounts
 */
export async function getCuentasByFondo(fondoId: string): Promise<CuentaBancariaListItem[]> {
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

  // Fetch accounts
  const cuentas = await db
    .select({
      id: cuentasBancarias.id,
      banco: cuentasBancarias.banco,
      numero: cuentasBancarias.numero,
      clabe: cuentasBancarias.clabe,
      moneda: cuentasBancarias.moneda,
      saldo: cuentasBancarias.saldo,
      activa: cuentasBancarias.activa,
    })
    .from(cuentasBancarias)
    .where(eq(cuentasBancarias.fondoId, fondoId))
    .orderBy(cuentasBancarias.banco);

  return cuentas.map((c) => ({
    ...c,
    moneda: c.moneda ?? 'MXN',
    saldo: c.saldo ?? '0',
    activa: c.activa ?? true,
  }));
}
