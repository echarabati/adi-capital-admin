'use server';

/**
 * Fondos Queries
 *
 * Server-side queries for fund management with RBAC filtering.
 * - Super Admin: sees all active funds
 * - Admin de Fondo: sees only assigned funds via user_fondos
 *
 * @see FOND-001
 */

import { eq, and, sql } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { fondos, proyectos, userFondos } from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type FondoListItem = {
  id: string;
  nombre: string;
  slug: string;
  monedaBase: string;
  proyectosCount: number;
  activo: boolean;
};

export type FondoDetail = {
  id: string;
  nombre: string;
  monedaBase: string;
  metodoCascada: string;
  successFeeDefault: string | null;
  prefRateDefault: string | null;
  capitalSocios: string | null;
  activo: boolean;
  proyectosCount: number;
};

// =============================================================================
// Get Fondos with RBAC
// =============================================================================

/**
 * Get all funds the current user has access to.
 *
 * RBAC:
 * - super_admin: All active funds
 * - admin_fondo: Only funds assigned via user_fondos
 * - agente: Only funds assigned via user_fondos
 *
 * @returns List of funds with project counts
 */
export async function getFondos(): Promise<FondoListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Subquery for project count
  const proyectosCountSq = db
    .select({
      fondoId: proyectos.fondoId,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(proyectos)
    .groupBy(proyectos.fondoId)
    .as('proyectos_count');

  // Super Admin: all active funds
  if (isSuperAdmin(userRole)) {
    const result = await db
      .select({
        id: fondos.id,
        nombre: fondos.nombre,
        monedaBase: fondos.monedaBase,
        activo: fondos.activo,
        proyectosCount: sql<number>`coalesce(${proyectosCountSq.count}, 0)`,
      })
      .from(fondos)
      .leftJoin(proyectosCountSq, eq(fondos.id, proyectosCountSq.fondoId))
      .where(eq(fondos.activo, true))
      .orderBy(fondos.nombre);

    return result.map((f) => ({
      ...f,
      slug: slugify(f.nombre),
      monedaBase: f.monedaBase ?? 'MXN',
      activo: f.activo ?? true,
      proyectosCount: Number(f.proyectosCount) || 0,
    }));
  }

  // Admin de Fondo / Agente: only assigned funds
  const result = await db
    .select({
      id: fondos.id,
      nombre: fondos.nombre,
      monedaBase: fondos.monedaBase,
      activo: fondos.activo,
      proyectosCount: sql<number>`coalesce(${proyectosCountSq.count}, 0)`,
    })
    .from(fondos)
    .innerJoin(userFondos, eq(fondos.id, userFondos.fondoId))
    .leftJoin(proyectosCountSq, eq(fondos.id, proyectosCountSq.fondoId))
    .where(and(eq(userFondos.userId, userId), eq(fondos.activo, true)))
    .orderBy(fondos.nombre);

  return result.map((f) => ({
    ...f,
    slug: slugify(f.nombre),
    monedaBase: f.monedaBase ?? 'MXN',
    activo: f.activo ?? true,
    proyectosCount: Number(f.proyectosCount) || 0,
  }));
}

// =============================================================================
// Get Fondo by ID with RBAC
// =============================================================================

/**
 * Get a single fund by ID with RBAC check.
 *
 * RBAC:
 * - super_admin: Any active fund
 * - admin_fondo/agente: Only assigned funds
 *
 * @param id - Fund UUID
 * @returns Fund detail or null if not found/no access
 */
export async function getFondoById(id: string): Promise<FondoDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Subquery for project count
  const proyectosCountSq = db
    .select({
      fondoId: proyectos.fondoId,
      count: sql<number>`count(*)`.as('count'),
    })
    .from(proyectos)
    .groupBy(proyectos.fondoId)
    .as('proyectos_count');

  // Super Admin: can access any fund
  if (isSuperAdmin(userRole)) {
    const [fondo] = await db
      .select({
        id: fondos.id,
        nombre: fondos.nombre,
        monedaBase: fondos.monedaBase,
        metodoCascada: fondos.metodoCascada,
        successFeeDefault: fondos.successFeeDefault,
        prefRateDefault: fondos.prefRateDefault,
        capitalSocios: fondos.capitalSocios,
        activo: fondos.activo,
        proyectosCount: sql<number>`coalesce(${proyectosCountSq.count}, 0)`,
      })
      .from(fondos)
      .leftJoin(proyectosCountSq, eq(fondos.id, proyectosCountSq.fondoId))
      .where(eq(fondos.id, id))
      .limit(1);

    if (!fondo) return null;

    return {
      ...fondo,
      monedaBase: fondo.monedaBase ?? 'MXN',
      metodoCascada: fondo.metodoCascada ?? 'pref_primero',
      activo: fondo.activo ?? true,
      proyectosCount: Number(fondo.proyectosCount) || 0,
    };
  }

  // Admin de Fondo / Agente: must be assigned to fund
  const [fondo] = await db
    .select({
      id: fondos.id,
      nombre: fondos.nombre,
      monedaBase: fondos.monedaBase,
      metodoCascada: fondos.metodoCascada,
      successFeeDefault: fondos.successFeeDefault,
      prefRateDefault: fondos.prefRateDefault,
      capitalSocios: fondos.capitalSocios,
      activo: fondos.activo,
      proyectosCount: sql<number>`coalesce(${proyectosCountSq.count}, 0)`,
    })
    .from(fondos)
    .innerJoin(userFondos, eq(fondos.id, userFondos.fondoId))
    .leftJoin(proyectosCountSq, eq(fondos.id, proyectosCountSq.fondoId))
    .where(and(eq(fondos.id, id), eq(userFondos.userId, userId)))
    .limit(1);

  if (!fondo) return null;

  return {
    ...fondo,
    monedaBase: fondo.monedaBase ?? 'MXN',
    metodoCascada: fondo.metodoCascada ?? 'pref_primero',
    activo: fondo.activo ?? true,
    proyectosCount: Number(fondo.proyectosCount) || 0,
  };
}

// =============================================================================
// Helpers
// =============================================================================

/**
 * Convert fund name to URL-friendly slug.
 */
function slugify(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '') // Remove accents
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
