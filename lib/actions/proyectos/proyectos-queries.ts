'use server';

/**
 * Proyectos Queries
 *
 * Server-side queries for projects with RBAC filtering.
 *
 * @see PROJ-001, PROJ-003
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
  fondoId: string;
  nombre: string;
  estado: 'inversion_abierta' | 'inversion_cerrada' | 'concluido';
  successFeePct: string | null;
  inversionRecibida: string;
  inversionistasCount: number;
};

export type ProyectoDetail = {
  id: string;
  fondoId: string;
  nombre: string;
  descripcion: string | null;
  estado: 'inversion_abierta' | 'inversion_cerrada' | 'concluido';
  metodoCascada: string | null;
  successFeePct: string | null;
  inversionRecibida: string;
  gastos: string;
  retornos: string;
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
      fondoId: proyectos.fondoId,
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
    fondoId: p.fondoId,
    nombre: p.nombre,
    estado: p.estado,
    successFeePct: p.successFeePct,
    inversionRecibida: p.inversionRecibida ?? '0',
    inversionistasCount: Number(p.inversionistasCount) || 0,
  }));
}

// =============================================================================
// Get Proyecto by ID
// =============================================================================

/**
 * Get a single project by ID.
 *
 * RBAC:
 * - super_admin: Any project
 * - admin_fondo/agente: Only projects in assigned funds
 *
 * @param id - Project UUID
 * @returns Project detail or null if not found/no access
 */
export async function getProyectoById(id: string): Promise<ProyectoDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Fetch project
  const [proyecto] = await db
    .select({
      id: proyectos.id,
      fondoId: proyectos.fondoId,
      nombre: proyectos.nombre,
      descripcion: proyectos.descripcion,
      estado: proyectos.estado,
      metodoCascada: proyectos.metodoCascada,
      successFeePct: proyectos.successFeePct,
      inversionRecibida: proyectos.inversionRecibida,
      gastos: proyectos.gastos,
      retornos: proyectos.retornos,
      inversionistasCount: sql<number>`(
        SELECT COUNT(DISTINCT ${inversiones.inversionistaId})
        FROM ${inversiones}
        WHERE ${inversiones.proyectoId} = ${proyectos.id}
      )`.as('inversionistas_count'),
    })
    .from(proyectos)
    .where(eq(proyectos.id, id))
    .limit(1);

  if (!proyecto) {
    return null;
  }

  // Check fund access for non-super_admin
  if (!isSuperAdmin(userRole)) {
    const [access] = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, proyecto.fondoId)))
      .limit(1);

    if (!access) {
      return null;
    }
  }

  return {
    id: proyecto.id,
    fondoId: proyecto.fondoId,
    nombre: proyecto.nombre,
    descripcion: proyecto.descripcion,
    estado: proyecto.estado,
    metodoCascada: proyecto.metodoCascada,
    successFeePct: proyecto.successFeePct,
    inversionRecibida: proyecto.inversionRecibida ?? '0',
    gastos: proyecto.gastos ?? '0',
    retornos: proyecto.retornos ?? '0',
    inversionistasCount: Number(proyecto.inversionistasCount) || 0,
  };
}
