'use server';

/**
 * Dashboard Queries
 *
 * Server-side queries for dashboard statistics with RBAC filtering.
 * - Super Admin: sees all funds
 * - Admin de Fondo: sees only assigned funds
 *
 * @see DASH-001
 */

import { eq, and, inArray, count, sum, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import {
  fondos,
  proyectos,
  inversionistas,
  inversiones,
  movimientos,
  userFondos,
} from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type DashboardStats = {
  capitalTotal: number;
  proyectosActivos: number;
  inversionistasCount: number;
  movimientosPendientes: number;
};

export type RecentMovimiento = {
  id: string;
  concepto: string;
  monto: string;
  moneda: string;
  estado: string;
  fechaMovimiento: Date;
  inversionista: { id: string; nombre: string } | null;
  proyecto: { id: string; nombre: string } | null;
};

// =============================================================================
// Get Dashboard Stats
// =============================================================================

/**
 * Get dashboard statistics with RBAC filtering.
 *
 * @param fondoId - Optional specific fund to filter (for CMP-007 FundSelector)
 * @returns Dashboard stats: capitalTotal, proyectosActivos, inversionistasCount, movimientosPendientes
 */
export async function getDashboardStats(fondoId?: string): Promise<DashboardStats> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Get accessible fondo IDs based on RBAC
  let accessibleFondoIds: string[] = [];

  if (isSuperAdmin(userRole)) {
    if (fondoId) {
      accessibleFondoIds = [fondoId];
    } else {
      const allFondos = await db
        .select({ id: fondos.id })
        .from(fondos)
        .where(eq(fondos.activo, true));
      accessibleFondoIds = allFondos.map((f) => f.id);
    }
  } else {
    const assignedFondos = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    accessibleFondoIds = assignedFondos.map((f) => f.fondoId);

    if (fondoId && !accessibleFondoIds.includes(fondoId)) {
      return {
        capitalTotal: 0,
        proyectosActivos: 0,
        inversionistasCount: 0,
        movimientosPendientes: 0,
      };
    }

    if (fondoId) {
      accessibleFondoIds = [fondoId];
    }
  }

  if (accessibleFondoIds.length === 0) {
    return {
      capitalTotal: 0,
      proyectosActivos: 0,
      inversionistasCount: 0,
      movimientosPendientes: 0,
    };
  }

  // Execute all queries in parallel
  const [capitalResult, proyectosResult, inversionistasResult, movimientosResult] =
    await Promise.all([
      // 1. Capital total from inversiones (sum of capital_aportado) - join through proyectos
      db
        .select({
          total: sum(inversiones.capitalAportado),
        })
        .from(inversiones)
        .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
        .where(inArray(proyectos.fondoId, accessibleFondoIds)),

      // 2. Active projects count (estado = 'inversion_abierta')
      db
        .select({ count: count() })
        .from(proyectos)
        .where(
          and(
            inArray(proyectos.fondoId, accessibleFondoIds),
            eq(proyectos.estado, 'inversion_abierta')
          )
        ),

      // 3. Distinct investors count in accessible funds (join through proyectos)
      db
        .select({ count: sql<number>`count(distinct ${inversionistas.id})` })
        .from(inversionistas)
        .innerJoin(inversiones, eq(inversiones.inversionistaId, inversionistas.id))
        .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
        .where(inArray(proyectos.fondoId, accessibleFondoIds)),

      // 4. Pending movements (estado = 'borrador')
      db
        .select({ count: count() })
        .from(movimientos)
        .where(
          and(inArray(movimientos.fondoId, accessibleFondoIds), eq(movimientos.estado, 'borrador'))
        ),
    ]);

  return {
    capitalTotal: Number(capitalResult[0]?.total ?? 0),
    proyectosActivos: proyectosResult[0]?.count ?? 0,
    inversionistasCount: Number(inversionistasResult[0]?.count ?? 0),
    movimientosPendientes: movimientosResult[0]?.count ?? 0,
  };
}

// =============================================================================
// Get Recent Movements for Dashboard
// =============================================================================

/**
 * Get recent movements for dashboard display.
 *
 * @param fondoId - Optional specific fund to filter
 * @param limit - Number of results (default 10)
 * @returns Recent movements with related entities
 */
export async function getRecentMovimientos(
  fondoId?: string,
  limit: number = 10
): Promise<RecentMovimiento[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Get accessible fondo IDs based on RBAC
  let accessibleFondoIds: string[] = [];

  if (isSuperAdmin(userRole)) {
    if (fondoId) {
      accessibleFondoIds = [fondoId];
    } else {
      const allFondos = await db
        .select({ id: fondos.id })
        .from(fondos)
        .where(eq(fondos.activo, true));
      accessibleFondoIds = allFondos.map((f) => f.id);
    }
  } else {
    const assignedFondos = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    accessibleFondoIds = assignedFondos.map((f) => f.fondoId);

    if (fondoId && !accessibleFondoIds.includes(fondoId)) {
      return [];
    }

    if (fondoId) {
      accessibleFondoIds = [fondoId];
    }
  }

  if (accessibleFondoIds.length === 0) {
    return [];
  }

  const result = await db
    .select({
      id: movimientos.id,
      concepto: movimientos.concepto,
      monto: movimientos.monto,
      moneda: movimientos.moneda,
      estado: movimientos.estado,
      fechaMovimiento: movimientos.fechaMovimiento,
      inversionistaId: movimientos.inversionistaId,
      inversionistaNombre: inversionistas.nombre,
      proyectoId: movimientos.proyectoId,
      proyectoNombre: proyectos.nombre,
    })
    .from(movimientos)
    .leftJoin(inversionistas, eq(movimientos.inversionistaId, inversionistas.id))
    .leftJoin(proyectos, eq(movimientos.proyectoId, proyectos.id))
    .where(inArray(movimientos.fondoId, accessibleFondoIds))
    .orderBy(sql`${movimientos.fechaMovimiento} desc`)
    .limit(limit);

  return result.map((row) => ({
    id: row.id,
    concepto: row.concepto,
    monto: row.monto,
    moneda: row.moneda,
    estado: row.estado,
    fechaMovimiento: row.fechaMovimiento,
    inversionista:
      row.inversionistaId && row.inversionistaNombre
        ? { id: row.inversionistaId, nombre: row.inversionistaNombre }
        : null,
    proyecto:
      row.proyectoId && row.proyectoNombre
        ? { id: row.proyectoId, nombre: row.proyectoNombre }
        : null,
  }));
}
