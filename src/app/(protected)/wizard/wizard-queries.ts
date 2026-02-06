'use server';

/**
 * Wizard Queries
 *
 * Server-side queries for wizard data.
 *
 * @see WIZ-001
 */

import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { proyectos, inversiones, userFondos, fondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type ProyectoForWizard = {
  id: string;
  nombre: string;
  fondoNombre: string;
  metodoCascada: string | null;
  inversionistasCount: number;
};

// =============================================================================
// Get Proyectos for Wizard
// =============================================================================

/**
 * Get projects available for distribution wizard.
 * Only returns projects with active investors.
 *
 * RBAC:
 * - super_admin: All projects
 * - admin_fondo: Only projects in assigned funds
 */
export async function getProyectosForWizard(): Promise<ProyectoForWizard[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Build query based on role
  let proyectosList;

  if (isSuperAdmin(userRole)) {
    // Super admin: all projects with investors
    proyectosList = await db
      .select({
        id: proyectos.id,
        nombre: proyectos.nombre,
        fondoNombre: fondos.nombre,
        metodoCascada: proyectos.metodoCascada,
        inversionistasCount: sql<number>`(
          SELECT COUNT(DISTINCT ${inversiones.inversionistaId})
          FROM ${inversiones}
          WHERE ${inversiones.proyectoId} = ${proyectos.id}
        )`.as('inversionistas_count'),
      })
      .from(proyectos)
      .innerJoin(fondos, eq(fondos.id, proyectos.fondoId))
      .where(
        sql`(
          SELECT COUNT(*) FROM ${inversiones}
          WHERE ${inversiones.proyectoId} = ${proyectos.id}
        ) > 0`
      )
      .orderBy(fondos.nombre, proyectos.nombre);
  } else {
    // Admin de fondo: only assigned funds
    proyectosList = await db
      .select({
        id: proyectos.id,
        nombre: proyectos.nombre,
        fondoNombre: fondos.nombre,
        metodoCascada: proyectos.metodoCascada,
        inversionistasCount: sql<number>`(
          SELECT COUNT(DISTINCT ${inversiones.inversionistaId})
          FROM ${inversiones}
          WHERE ${inversiones.proyectoId} = ${proyectos.id}
        )`.as('inversionistas_count'),
      })
      .from(proyectos)
      .innerJoin(fondos, eq(fondos.id, proyectos.fondoId))
      .innerJoin(userFondos, eq(userFondos.fondoId, fondos.id))
      .where(
        and(
          eq(userFondos.userId, userId),
          sql`(
            SELECT COUNT(*) FROM ${inversiones}
            WHERE ${inversiones.proyectoId} = ${proyectos.id}
          ) > 0`
        )
      )
      .orderBy(fondos.nombre, proyectos.nombre);
  }

  return proyectosList.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    fondoNombre: p.fondoNombre,
    metodoCascada: p.metodoCascada,
    inversionistasCount: Number(p.inversionistasCount) || 0,
  }));
}

// =============================================================================
// Types for Inversiones
// =============================================================================

export type InversionForCascada = {
  inversionId: string;
  inversionistaNombre: string;
  capitalAportado: number;
  prefAcumulado: number;
  prefPagado: number;
  successFeePct: number;
};

// =============================================================================
// Get Inversiones for Cascada Calculation
// =============================================================================

/**
 * Get investments for cascada calculation.
 * Returns data needed by calcularCascadaPrefPrimero/calcularCascadaCapitalPrimero.
 */
export async function getInversionesForCascada(proyectoId: string): Promise<InversionForCascada[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  // Get proyecto with fondo info for default success fee
  const proyecto = await db.query.proyectos.findFirst({
    where: eq(proyectos.id, proyectoId),
    with: {
      fondo: true,
    },
  });

  if (!proyecto) return [];

  // Get inversiones with inversionista names
  const inversionesList = await db
    .select({
      id: inversiones.id,
      nombre: sql<string>`(
        SELECT nombre FROM inversionistas
        WHERE id = ${inversiones.inversionistaId}
      )`,
      capitalAportado: inversiones.capitalAportado,
      prefAcumulado: inversiones.prefAcumulado,
      prefPagado: inversiones.prefPagado,
      successFeePct: inversiones.successFeePct,
    })
    .from(inversiones)
    .where(eq(inversiones.proyectoId, proyectoId));

  // Default success fee hierarchy: inversion > proyecto > fondo > 20%
  const defaultFeePct = proyecto.successFeePct ?? proyecto.fondo?.successFeeDefault ?? 20;

  return inversionesList.map((inv) => ({
    inversionId: inv.id,
    inversionistaNombre: inv.nombre || 'Inversionista',
    capitalAportado: Number(inv.capitalAportado) || 0,
    prefAcumulado: Number(inv.prefAcumulado) || 0,
    prefPagado: Number(inv.prefPagado) || 0,
    successFeePct: Number(inv.successFeePct) ?? Number(defaultFeePct),
  }));
}
