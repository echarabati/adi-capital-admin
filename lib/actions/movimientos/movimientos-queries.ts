'use server';

/**
 * Movimientos Queries
 *
 * Server-side queries for financial movements with RBAC filtering.
 * - Super Admin: sees all movimientos
 * - Admin de Fondo: sees movimientos from assigned funds
 *
 * @see MOV-001
 */

import { eq, and, inArray, desc, gte, lte } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import {
  movimientos,
  fondos,
  proyectos,
  inversionistas,
  inversiones,
  userFondos,
} from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type MovimientoListItem = {
  id: string;
  concepto: string;
  monto: string;
  moneda: string;
  estado: string;
  fechaMovimiento: Date;
  descripcion: string | null;
  fondo: { id: string; nombre: string } | null;
  proyecto: { id: string; nombre: string } | null;
  inversionista: { id: string; nombre: string } | null;
  inversion: { id: string } | null;
};

export type GetMovimientosParams = {
  fondoId?: string;
  concepto?: string;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
};

// =============================================================================
// Get Movimientos with RBAC
// =============================================================================

/**
 * Get all movimientos the current user has access to.
 *
 * RBAC:
 * - super_admin: All movimientos (optionally filtered by fondo)
 * - admin_fondo: Only movimientos in assigned funds
 *
 * @param params - Optional filters
 * @returns List of movimientos with related entities
 */
export async function getMovimientos(
  params: GetMovimientosParams = {}
): Promise<MovimientoListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;
  const { fondoId, concepto, estado, fechaDesde, fechaHasta } = params;

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

  // Build conditions
  const conditions = [inArray(movimientos.fondoId, accessibleFondoIds)];

  if (concepto) {
    conditions.push(
      eq(movimientos.concepto, concepto as (typeof movimientos.concepto.enumValues)[number])
    );
  }

  if (estado) {
    conditions.push(
      eq(movimientos.estado, estado as (typeof movimientos.estado.enumValues)[number])
    );
  }

  if (fechaDesde) {
    conditions.push(gte(movimientos.fechaMovimiento, new Date(fechaDesde)));
  }

  if (fechaHasta) {
    conditions.push(lte(movimientos.fechaMovimiento, new Date(fechaHasta)));
  }

  // Query with joins
  const result = await db
    .select({
      id: movimientos.id,
      concepto: movimientos.concepto,
      monto: movimientos.monto,
      moneda: movimientos.moneda,
      estado: movimientos.estado,
      fechaMovimiento: movimientos.fechaMovimiento,
      descripcion: movimientos.descripcion,
      fondoId: movimientos.fondoId,
      fondoNombre: fondos.nombre,
      proyectoId: movimientos.proyectoId,
      proyectoNombre: proyectos.nombre,
      inversionistaId: movimientos.inversionistaId,
      inversionistaNombre: inversionistas.nombre,
      inversionId: movimientos.inversionId,
    })
    .from(movimientos)
    .innerJoin(fondos, eq(movimientos.fondoId, fondos.id))
    .leftJoin(proyectos, eq(movimientos.proyectoId, proyectos.id))
    .leftJoin(inversionistas, eq(movimientos.inversionistaId, inversionistas.id))
    .leftJoin(inversiones, eq(movimientos.inversionId, inversiones.id))
    .where(and(...conditions))
    .orderBy(desc(movimientos.fechaMovimiento))
    .limit(500);

  return result.map((row) => ({
    id: row.id,
    concepto: row.concepto,
    monto: row.monto,
    moneda: row.moneda,
    estado: row.estado,
    fechaMovimiento: row.fechaMovimiento,
    descripcion: row.descripcion,
    fondo: { id: row.fondoId, nombre: row.fondoNombre },
    proyecto:
      row.proyectoId && row.proyectoNombre
        ? { id: row.proyectoId, nombre: row.proyectoNombre }
        : null,
    inversionista:
      row.inversionistaId && row.inversionistaNombre
        ? { id: row.inversionistaId, nombre: row.inversionistaNombre }
        : null,
    inversion: row.inversionId ? { id: row.inversionId } : null,
  }));
}
