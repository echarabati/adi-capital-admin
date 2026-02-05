'use server';

/**
 * Calendario Pagos Queries
 *
 * Server-side queries for capital calls with RBAC filtering.
 *
 * @see INVE-005
 */

import { eq, asc } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { calendarioPagos, inversiones, proyectos, fondos, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export interface CalendarioPagoListItem {
  id: string;
  numero: number;
  fechaProgramada: Date;
  montoEsperado: string;
  montoPagado: string;
  estado: 'pendiente' | 'parcial' | 'completo';
  notas: string | null;
}

// =============================================================================
// Get Calendario by Inversion
// =============================================================================

/**
 * Get all capital calls for an investment.
 *
 * RBAC:
 * - super_admin: Any investment
 * - admin_fondo/agente: Only investments in assigned funds
 *
 * @param inversionId - Investment UUID
 * @returns List of capital calls ordered by numero
 */
export async function getCalendarioPagosByInversion(
  inversionId: string
): Promise<CalendarioPagoListItem[]> {
  const session = await auth();
  if (!session?.user) return [];

  // Build base query
  const results = await db
    .select({
      id: calendarioPagos.id,
      numero: calendarioPagos.numero,
      fechaProgramada: calendarioPagos.fechaProgramada,
      montoEsperado: calendarioPagos.montoEsperado,
      montoPagado: calendarioPagos.montoPagado,
      estado: calendarioPagos.estado,
      notas: calendarioPagos.notas,
      // For RBAC check
      fondoId: fondos.id,
    })
    .from(calendarioPagos)
    .innerJoin(inversiones, eq(calendarioPagos.inversionId, inversiones.id))
    .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
    .innerJoin(fondos, eq(proyectos.fondoId, fondos.id))
    .where(eq(calendarioPagos.inversionId, inversionId))
    .orderBy(asc(calendarioPagos.numero));

  // If super_admin, return all
  if (isSuperAdmin(session.user.role)) {
    return results.map((row) => ({
      id: row.id,
      numero: row.numero,
      fechaProgramada: row.fechaProgramada,
      montoEsperado: row.montoEsperado,
      montoPagado: row.montoPagado ?? '0',
      estado: row.estado,
      notas: row.notas,
    }));
  }

  // For non-super_admin, check fund access
  const userFondosList = await db
    .select({ fondoId: userFondos.fondoId })
    .from(userFondos)
    .where(eq(userFondos.userId, session.user.id));

  const userFondoIds = new Set(userFondosList.map((f) => f.fondoId));

  return results
    .filter((row) => userFondoIds.has(row.fondoId))
    .map((row) => ({
      id: row.id,
      numero: row.numero,
      fechaProgramada: row.fechaProgramada,
      montoEsperado: row.montoEsperado,
      montoPagado: row.montoPagado ?? '0',
      estado: row.estado,
      notas: row.notas,
    }));
}

// =============================================================================
// Get next numero for capital call
// =============================================================================

/**
 * Get the next sequential number for a new capital call.
 */
export async function getNextCalendarioNumero(inversionId: string): Promise<number> {
  const result = await db
    .select({ numero: calendarioPagos.numero })
    .from(calendarioPagos)
    .where(eq(calendarioPagos.inversionId, inversionId))
    .orderBy(asc(calendarioPagos.numero));

  if (result.length === 0) return 1;
  return Math.max(...result.map((r) => r.numero)) + 1;
}
