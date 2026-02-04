'use server';

/**
 * Proyectos Queries
 *
 * Server-side queries for projects with RBAC filtering.
 *
 * @see PROJ-001
 */

import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { proyectos, inversiones, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type ProyectoListItem = {
  id: string;
  nombre: string;
  estado: 'activo' | 'cerrado' | 'en_desarrollo';
  successFeePct: string | null;
  inversionRecibida: string;
  inversionistasCount: number;
};

// =============================================================================
// Get Proyectos by Fondo
// =============================================================================

/**
 * Get all projects for a fund.
 *
 * RBAC:
 * - super_admin: Any fund
 * - admin_fondo/agente: Only assigned funds
 *
 * @param fondoId - Fund UUID
 * @returns List of projects with investor count
 */
export async function getProyectosByFondo(fondoId: string): Promise<ProyectoListItem[]> {
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

  // Fetch projects with investor count
  const proyectosList = await db
    .select({
      id: proyectos.id,
      nombre: proyectos.nombre,
      estado: proyectos.estado,
      successFeePct: proyectos.successFeePct,
      inversionRecibida: proyectos.inversionRecibida,
      inversionistasCount: sql<number>`(
        SELECT COUNT(DISTINCT ${inversiones.inversionistaId})
        FROM ${inversiones}
        WHERE ${inversiones.proyectoId} = ${proyectos.id}
      )`.as('inversionistas_count'),
    })
    .from(proyectos)
    .where(eq(proyectos.fondoId, fondoId))
    .orderBy(proyectos.nombre);

  return proyectosList.map((p) => ({
    id: p.id,
    nombre: p.nombre,
    estado: p.estado,
    successFeePct: p.successFeePct,
    inversionRecibida: p.inversionRecibida ?? '0',
    inversionistasCount: Number(p.inversionistasCount) || 0,
  }));
}
