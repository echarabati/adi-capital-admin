'use server';

/**
 * Inversiones Queries
 *
 * Server-side queries for investments with RBAC filtering.
 *
 * @see INVE-001
 */

import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import {
  inversiones,
  inversionistas,
  inversionistasFondos,
  proyectos,
  userFondos,
} from '@/lib/db/schema';
import { isSuperAdmin } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type InversionEstado = 'pendiente' | 'parcial' | 'completado' | 'excedido';

export type InversionListItem = {
  id: string;
  inversionistaId: string;
  inversionistaNombre: string;
  proyectoId: string;
  proyectoNombre: string;
  compromiso: string;
  capitalAportado: string;
  estado: InversionEstado;
};

export type InversionistaDropdownItem = {
  id: string;
  nombre: string;
};

// =============================================================================
// Helpers
// =============================================================================

/**
 * Calculate investment status based on commitment vs contributed.
 */
function calculateEstado(compromiso: string, capitalAportado: string): InversionEstado {
  const compromisoNum = Number(compromiso) || 0;
  const aportadoNum = Number(capitalAportado) || 0;

  if (compromisoNum === 0) return 'pendiente';
  if (aportadoNum === 0) return 'pendiente';
  if (aportadoNum >= compromisoNum) {
    return aportadoNum > compromisoNum ? 'excedido' : 'completado';
  }
  return 'parcial';
}

// =============================================================================
// Get Inversiones by Proyecto
// =============================================================================

/**
 * Get all investments for a project.
 *
 * RBAC:
 * - super_admin: Any project
 * - admin_fondo/agente: Only projects in assigned funds
 *
 * @param proyectoId - Project UUID
 * @returns List of investments with inversionista name
 */
export async function getInversionesByProyecto(proyectoId: string): Promise<InversionListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Get proyecto to check fund access
  const [proyecto] = await db
    .select({ fondoId: proyectos.fondoId, nombre: proyectos.nombre })
    .from(proyectos)
    .where(eq(proyectos.id, proyectoId))
    .limit(1);

  if (!proyecto) {
    throw new Error('Proyecto no encontrado');
  }

  // Check fund access for non-super_admin
  if (!isSuperAdmin(userRole)) {
    const [access] = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, proyecto.fondoId)))
      .limit(1);

    if (!access) {
      throw new Error('No tienes acceso a este proyecto');
    }
  }

  // Fetch investments with inversionista name
  const inversionesList = await db
    .select({
      id: inversiones.id,
      inversionistaId: inversiones.inversionistaId,
      inversionistaNombre: inversionistas.nombre,
      proyectoId: inversiones.proyectoId,
      compromiso: inversiones.compromiso,
      capitalAportado: inversiones.capitalAportado,
    })
    .from(inversiones)
    .innerJoin(inversionistas, eq(inversiones.inversionistaId, inversionistas.id))
    .where(eq(inversiones.proyectoId, proyectoId))
    .orderBy(inversionistas.nombre);

  return inversionesList.map((inv) => ({
    id: inv.id,
    inversionistaId: inv.inversionistaId,
    inversionistaNombre: inv.inversionistaNombre,
    proyectoId: inv.proyectoId,
    proyectoNombre: proyecto.nombre,
    compromiso: inv.compromiso,
    capitalAportado: inv.capitalAportado ?? '0',
    estado: calculateEstado(inv.compromiso, inv.capitalAportado ?? '0'),
  }));
}

// =============================================================================
// Get Inversiones by Inversionista
// =============================================================================

/**
 * Get all investments for an investor.
 *
 * RBAC:
 * - super_admin: Any investor
 * - admin_fondo/agente: Only investments in assigned funds
 *
 * @param inversionistaId - Investor UUID
 * @returns List of investments with proyecto name
 */
export async function getInversionesByInversionista(
  inversionistaId: string
): Promise<InversionListItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Fetch investments with proyecto and fund info
  const inversionesList = await db
    .select({
      id: inversiones.id,
      inversionistaId: inversiones.inversionistaId,
      proyectoId: inversiones.proyectoId,
      proyectoNombre: proyectos.nombre,
      fondoId: proyectos.fondoId,
      compromiso: inversiones.compromiso,
      capitalAportado: inversiones.capitalAportado,
    })
    .from(inversiones)
    .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
    .where(eq(inversiones.inversionistaId, inversionistaId))
    .orderBy(proyectos.nombre);

  // Get inversionista name
  const [inversionista] = await db
    .select({ nombre: inversionistas.nombre })
    .from(inversionistas)
    .where(eq(inversionistas.id, inversionistaId))
    .limit(1);

  if (!inversionista) {
    throw new Error('Inversionista no encontrado');
  }

  // Filter by fund access for non-super_admin
  let filteredInversiones = inversionesList;
  if (!isSuperAdmin(userRole)) {
    const userFondosList = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(eq(userFondos.userId, userId));

    const accessibleFondoIds = new Set(userFondosList.map((uf) => uf.fondoId));
    filteredInversiones = inversionesList.filter((inv) => accessibleFondoIds.has(inv.fondoId));
  }

  return filteredInversiones.map((inv) => ({
    id: inv.id,
    inversionistaId: inv.inversionistaId,
    inversionistaNombre: inversionista.nombre,
    proyectoId: inv.proyectoId,
    proyectoNombre: inv.proyectoNombre,
    compromiso: inv.compromiso,
    capitalAportado: inv.capitalAportado ?? '0',
    estado: calculateEstado(inv.compromiso, inv.capitalAportado ?? '0'),
  }));
}

// =============================================================================
// Get Inversionistas by Fondo (for dropdown)
// =============================================================================

/**
 * Get inversionistas that belong to a specific fondo.
 * Used for dropdown selectors when creating inversiones.
 *
 * @param fondoId - Fund UUID
 * @returns List of inversionistas (id, nombre) for dropdown
 */
export async function getInversionistasByFondo(
  fondoId: string
): Promise<InversionistaDropdownItem[]> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const result = await db
    .select({
      id: inversionistas.id,
      nombre: inversionistas.nombre,
    })
    .from(inversionistasFondos)
    .innerJoin(inversionistas, eq(inversionistasFondos.inversionistaId, inversionistas.id))
    .where(eq(inversionistasFondos.fondoId, fondoId))
    .orderBy(inversionistas.nombre);

  return result;
}

// =============================================================================
// Get Inversiones for Selector (MovimientoForm)
// =============================================================================

export type InversionSelectorItem = {
  id: string;
  inversionistaId: string;
  inversionistaNombre: string;
  proyectoId: string;
  proyectoNombre: string;
  compromiso: string;
  capitalAportado: string;
};

/**
 * Get all inversiones for a fondo (used in MovimientoForm selector).
 * Groups by proyecto for display.
 *
 * RBAC:
 * - super_admin: Any fondo
 * - admin_fondo/agente: Only assigned fondos
 *
 * @param fondoId - Fund UUID
 * @returns List of inversiones with proyecto and inversionista names
 * @see MOV-003
 */
export async function getInversionesForSelector(fondoId: string): Promise<InversionSelectorItem[]> {
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
      return [];
    }
  }

  // Fetch all inversiones for this fondo
  const result = await db
    .select({
      id: inversiones.id,
      inversionistaId: inversiones.inversionistaId,
      inversionistaNombre: inversionistas.nombre,
      proyectoId: inversiones.proyectoId,
      proyectoNombre: proyectos.nombre,
      compromiso: inversiones.compromiso,
      capitalAportado: inversiones.capitalAportado,
    })
    .from(inversiones)
    .innerJoin(inversionistas, eq(inversiones.inversionistaId, inversionistas.id))
    .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
    .where(eq(proyectos.fondoId, fondoId))
    .orderBy(proyectos.nombre, inversionistas.nombre);

  return result.map((inv) => ({
    id: inv.id,
    inversionistaId: inv.inversionistaId,
    inversionistaNombre: inv.inversionistaNombre,
    proyectoId: inv.proyectoId,
    proyectoNombre: inv.proyectoNombre,
    compromiso: inv.compromiso,
    capitalAportado: inv.capitalAportado ?? '0',
  }));
}

// =============================================================================
// Inversion Detail (for detail page)
// =============================================================================

export type InversionDetail = {
  id: string;
  inversionistaId: string;
  inversionistaNombre: string;
  proyectoId: string;
  proyectoNombre: string;
  fondoId: string;
  fondoNombre: string;
  compromiso: string;
  capitalAportado: string;
  prefAcumulado: string;
  prefPagado: string;
  prefRate: string | null;
  successFeePct: string | null;
  adminFeeTipo: string | null;
  adminFeePct: string | null;
  adminFeeBase: string | null;
  adminFeeMetodo: string | null;
  notas: string | null;
  estado: InversionEstado;
};

/**
 * Get a single inversion by ID with full details for the detail page.
 *
 * RBAC:
 * - super_admin: Any inversion
 * - admin_fondo/agente: Only inversiones in assigned funds
 *
 * @param id - Inversion UUID
 * @returns Full inversion detail or null if not found/no access
 */
export async function getInversionById(id: string): Promise<InversionDetail | null> {
  const session = await auth();
  if (!session?.user?.id) {
    throw new Error('Debes iniciar sesión');
  }

  const userId = session.user.id;
  const userRole = session.user.role;

  // Fetch inversion with related data
  const [result] = await db
    .select({
      id: inversiones.id,
      inversionistaId: inversiones.inversionistaId,
      inversionistaNombre: inversionistas.nombre,
      proyectoId: inversiones.proyectoId,
      proyectoNombre: proyectos.nombre,
      fondoId: proyectos.fondoId,
      compromiso: inversiones.compromiso,
      capitalAportado: inversiones.capitalAportado,
      prefAcumulado: inversiones.prefAcumulado,
      prefPagado: inversiones.prefPagado,
      prefRate: inversiones.prefRate,
      successFeePct: inversiones.successFeePct,
      adminFeeTipo: inversiones.adminFeeTipo,
      adminFeePct: inversiones.adminFeePct,
      adminFeeBase: inversiones.adminFeeBase,
      adminFeeMetodo: inversiones.adminFeeMetodo,
      notas: inversiones.notas,
    })
    .from(inversiones)
    .innerJoin(inversionistas, eq(inversiones.inversionistaId, inversionistas.id))
    .innerJoin(proyectos, eq(inversiones.proyectoId, proyectos.id))
    .where(eq(inversiones.id, id))
    .limit(1);

  if (!result) return null;

  // RBAC check: user must have access to the fund
  if (!isSuperAdmin(userRole)) {
    const [access] = await db
      .select({ fondoId: userFondos.fondoId })
      .from(userFondos)
      .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, result.fondoId)))
      .limit(1);

    if (!access) return null;
  }

  // Get fondo name
  const { fondos } = await import('@/lib/db/schema');
  const [fondoData] = await db
    .select({ nombre: fondos.nombre })
    .from(fondos)
    .where(eq(fondos.id, result.fondoId))
    .limit(1);

  return {
    id: result.id,
    inversionistaId: result.inversionistaId,
    inversionistaNombre: result.inversionistaNombre,
    proyectoId: result.proyectoId,
    proyectoNombre: result.proyectoNombre,
    fondoId: result.fondoId,
    fondoNombre: fondoData?.nombre ?? '',
    compromiso: result.compromiso,
    capitalAportado: result.capitalAportado ?? '0',
    prefAcumulado: result.prefAcumulado ?? '0',
    prefPagado: result.prefPagado ?? '0',
    prefRate: result.prefRate,
    successFeePct: result.successFeePct,
    adminFeeTipo: result.adminFeeTipo,
    adminFeePct: result.adminFeePct,
    adminFeeBase: result.adminFeeBase,
    adminFeeMetodo: result.adminFeeMetodo,
    notas: result.notas,
    estado: calculateEstado(result.compromiso, result.capitalAportado ?? '0'),
  };
}
