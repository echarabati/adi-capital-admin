'use server';

/**
 * Inversionistas Queries
 *
 * Server-side queries for investor management with RBAC filtering.
 * - Super Admin: sees all inversionistas
 * - Admin de Fondo: sees inversionistas in assigned funds
 *
 * @see INV-001
 */

import { eq, and, or, ilike, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { inversionistas, inversionistasFondos, fondos, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type InversionistaListItem = {
  id: string;
  nombre: string;
  email: string | null;
  telefono: string | null;
  esFundador: boolean;
  porcentajePropiedad: string | null;
  fondos: { id: string; nombre: string }[];
};

export type GetInversionistasParams = {
  fondoId?: string;
  search?: string;
};

// =============================================================================
// Get Inversionistas with RBAC
// =============================================================================

/**
 * Get all inversionistas the current user has access to.
 *
 * RBAC:
 * - super_admin: All inversionistas (optionally filtered by fondo)
 * - admin_fondo: Only inversionistas in assigned funds
 *
 * @param params - Optional filters (fondoId, search)
 * @returns List of inversionistas with their associated fondos
 */
export async function getInversionistas(
  params: GetInversionistasParams = {}
): Promise<InversionistaListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;
  const { fondoId, search } = params;

  // Get fondos the user has access to
  let accessibleFondoIds: string[] = [];

  if (isSuperAdmin(userRole)) {
    // Super Admin: all fondos (or specific if filtered)
    if (fondoId) {
      accessibleFondoIds = [fondoId];
    } else {
      // Get all active fondos
      const allFondos = await db
        .select({ id: fondos.id })
        .from(fondos)
        .where(eq(fondos.activo, true));
      accessibleFondoIds = allFondos.map((f) => f.id);
    }
  } else {
    // Admin de Fondo: only assigned fondos
    const assignedFondos = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    accessibleFondoIds = assignedFondos.map((f) => f.fondoId);

    // If filtering by fondo, ensure user has access
    if (fondoId && !accessibleFondoIds.includes(fondoId)) {
      return []; // No access to requested fondo
    }

    if (fondoId) {
      accessibleFondoIds = [fondoId];
    }
  }

  if (accessibleFondoIds.length === 0) {
    return [];
  }

  // Get inversionistas that belong to accessible fondos
  const inversionistaIdsInFondos = await db
    .selectDistinct({ inversionistaId: inversionistasFondos.inversionistaId })
    .from(inversionistasFondos)
    .where(inArray(inversionistasFondos.fondoId, accessibleFondoIds));

  const inversionistaIds = inversionistaIdsInFondos.map((i) => i.inversionistaId);

  if (inversionistaIds.length === 0) {
    return [];
  }

  // Build base query conditions
  const conditions = [inArray(inversionistas.id, inversionistaIds)];

  // Add search filter
  if (search) {
    conditions.push(
      or(ilike(inversionistas.nombre, `%${search}%`), ilike(inversionistas.email, `%${search}%`))!
    );
  }

  // Get inversionistas
  const result = await db
    .select({
      id: inversionistas.id,
      nombre: inversionistas.nombre,
      email: inversionistas.email,
      telefono: inversionistas.telefono,
      esFundador: inversionistas.esFundador,
      porcentajePropiedad: inversionistas.porcentajePropiedad,
    })
    .from(inversionistas)
    .where(and(...conditions))
    .orderBy(inversionistas.nombre);

  // Get fondos for each inversionista (only accessible ones)
  const inversionistasWithFondos: InversionistaListItem[] = await Promise.all(
    result.map(async (inv) => {
      const invFondos = await db
        .select({
          id: fondos.id,
          nombre: fondos.nombre,
        })
        .from(inversionistasFondos)
        .innerJoin(fondos, eq(inversionistasFondos.fondoId, fondos.id))
        .where(
          and(
            eq(inversionistasFondos.inversionistaId, inv.id),
            inArray(fondos.id, accessibleFondoIds)
          )
        )
        .orderBy(fondos.nombre);

      return {
        ...inv,
        esFundador: inv.esFundador ?? false,
        porcentajePropiedad: inv.porcentajePropiedad ?? null,
        fondos: invFondos,
      };
    })
  );

  return inversionistasWithFondos;
}

// =============================================================================
// Get Inversionista by ID with RBAC
// =============================================================================

/**
 * Get a single inversionista by ID with RBAC check.
 *
 * @param id - Inversionista UUID
 * @returns Inversionista detail or null if not found/no access
 */
export async function getInversionistaById(id: string): Promise<InversionistaListItem | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Get the inversionista first
  const [inv] = await db
    .select({
      id: inversionistas.id,
      nombre: inversionistas.nombre,
      email: inversionistas.email,
      telefono: inversionistas.telefono,
      esFundador: inversionistas.esFundador,
      porcentajePropiedad: inversionistas.porcentajePropiedad,
    })
    .from(inversionistas)
    .where(eq(inversionistas.id, id))
    .limit(1);

  if (!inv) return null;

  // Get fondos this inversionista belongs to
  const invFondos = await db
    .select({
      id: fondos.id,
      nombre: fondos.nombre,
    })
    .from(inversionistasFondos)
    .innerJoin(fondos, eq(inversionistasFondos.fondoId, fondos.id))
    .where(eq(inversionistasFondos.inversionistaId, id));

  // RBAC check: user must have access to at least one of the fondos
  if (!isSuperAdmin(userRole)) {
    const assignedFondos = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    const assignedFondoIds = assignedFondos.map((f) => f.fondoId);
    const hasAccess = invFondos.some((f) => assignedFondoIds.includes(f.id));

    if (!hasAccess) return null;
  }

  return {
    ...inv,
    esFundador: inv.esFundador ?? false,
    porcentajePropiedad: inv.porcentajePropiedad ?? null,
    fondos: invFondos,
  };
}
