'use server';

/**
 * Noticias Queries
 *
 * Server-side queries for news management with RBAC filtering.
 * - Super Admin: sees all noticias
 * - Admin de Fondo: sees noticias for assigned funds + general noticias
 *
 * @see NEWS-001
 */

import { db } from '@/lib/db/drizzle';
import { noticias, fondos } from '@/lib/db/schema';
import { userFondos } from '@/lib/db/schema/user-fondos';
import { eq, desc, or, isNull, inArray } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type NoticiaListItem = {
  id: string;
  titulo: string;
  contenido: string;
  imagenUrl: string | null;
  estado: 'borrador' | 'publicado';
  fondoId: string | null;
  fondoNombre: string | null; // null for general news
  publicadoAt: Date | null;
  createdAt: Date | null;
};

interface GetNoticiasParams {
  fondoId?: string;
  estado?: 'borrador' | 'publicado';
}

// =============================================================================
// Get Noticias with RBAC
// =============================================================================

/**
 * Get all noticias the current user has access to.
 *
 * RBAC:
 * - super_admin: All noticias (optionally filtered by fondo)
 * - admin_fondo: Noticias in assigned funds + general noticias (fondoId = null)
 *
 * @param params - Optional filters (fondoId, estado)
 * @returns List of noticias with fondo names
 */
export async function getNoticias(params: GetNoticiasParams = {}): Promise<NoticiaListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    return [];
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Build base query with fondo join
  const baseQuery = db
    .select({
      id: noticias.id,
      titulo: noticias.titulo,
      contenido: noticias.contenido,
      imagenUrl: noticias.imagenUrl,
      estado: noticias.estado,
      fondoId: noticias.fondoId,
      fondoNombre: fondos.nombre,
      publicadoAt: noticias.publicadoAt,
      createdAt: noticias.createdAt,
    })
    .from(noticias)
    .leftJoin(fondos, eq(noticias.fondoId, fondos.id))
    .orderBy(desc(noticias.createdAt));

  type NoticiaQueryResult = {
    id: string;
    titulo: string;
    contenido: string;
    imagenUrl: string | null;
    estado: 'borrador' | 'publicado';
    fondoId: string | null;
    fondoNombre: string | null;
    publicadoAt: Date | null;
    createdAt: Date | null;
  };

  let results: NoticiaQueryResult[];

  if (isSuperAdmin(userRole)) {
    // Super Admin: see all, optionally filtered
    if (params.fondoId) {
      if (params.fondoId === 'general') {
        // Only general news
        results = await baseQuery.where(isNull(noticias.fondoId));
      } else {
        // Specific fund
        results = await baseQuery.where(eq(noticias.fondoId, params.fondoId));
      }
    } else {
      // All noticias
      results = await baseQuery;
    }
  } else {
    // Admin de Fondo: assigned funds + general
    const assignedFundIds = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    const fondoIds = assignedFundIds.map((r) => r.fondoId);

    if (fondoIds.length === 0) {
      // Only general news if no funds assigned
      results = await baseQuery.where(isNull(noticias.fondoId));
    } else if (params.fondoId) {
      // Filter by specific fund (must be in assigned list or general)
      if (params.fondoId === 'general') {
        results = await baseQuery.where(isNull(noticias.fondoId));
      } else if (fondoIds.includes(params.fondoId)) {
        results = await baseQuery.where(eq(noticias.fondoId, params.fondoId));
      } else {
        results = [];
      }
    } else {
      // All accessible: assigned funds + general
      results = await baseQuery.where(
        or(isNull(noticias.fondoId), inArray(noticias.fondoId, fondoIds))
      );
    }
  }

  // Filter by estado if specified
  if (params.estado && Array.isArray(results)) {
    results = results.filter((n) => n.estado === params.estado);
  }

  return results.map((n) => ({
    id: n.id,
    titulo: n.titulo,
    contenido: n.contenido,
    imagenUrl: n.imagenUrl,
    estado: n.estado,
    fondoId: n.fondoId,
    fondoNombre: n.fondoId ? n.fondoNombre : 'General',
    publicadoAt: n.publicadoAt,
    createdAt: n.createdAt,
  }));
}

// =============================================================================
// Get Noticia by ID with RBAC
// =============================================================================

/**
 * Get a single noticia by ID with RBAC check.
 *
 * @param id - Noticia UUID
 * @returns Noticia detail or null if not found/no access
 */
export async function getNoticiaById(id: string): Promise<NoticiaListItem | null> {
  const session = await auth();
  if (!session?.user?.id) {
    return null;
  }

  const result = await db
    .select({
      id: noticias.id,
      titulo: noticias.titulo,
      contenido: noticias.contenido,
      imagenUrl: noticias.imagenUrl,
      estado: noticias.estado,
      fondoId: noticias.fondoId,
      fondoNombre: fondos.nombre,
      publicadoAt: noticias.publicadoAt,
      createdAt: noticias.createdAt,
    })
    .from(noticias)
    .leftJoin(fondos, eq(noticias.fondoId, fondos.id))
    .where(eq(noticias.id, id))
    .limit(1);

  if (result.length === 0) {
    return null;
  }

  const n = result[0];

  // RBAC check for non-super-admin
  if (!isSuperAdmin(session.user.role) && n.fondoId) {
    const hasAccess = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, session.user.id))
      .then((rows) => rows.some((r) => r.fondoId === n.fondoId));

    if (!hasAccess) {
      return null;
    }
  }

  return {
    id: n.id,
    titulo: n.titulo,
    contenido: n.contenido,
    imagenUrl: n.imagenUrl,
    estado: n.estado,
    fondoId: n.fondoId,
    fondoNombre: n.fondoId ? n.fondoNombre : 'General',
    publicadoAt: n.publicadoAt,
    createdAt: n.createdAt,
  };
}
