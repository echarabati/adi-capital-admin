'use server';

/**
 * Proyectos Mutations
 *
 * Server actions for creating and updating projects.
 * Requires admin_fondo+ role.
 *
 * @see PROJ-002
 */

import { revalidatePath } from 'next/cache';
import { eq, and } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { proyectos, userFondos } from '@/lib/db/schema';
import {
  createProyectoSchema,
  updateProyectoSchema,
} from '@/lib/validations/proyectos/proyecto-validation';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';

// =============================================================================
// Types
// =============================================================================

export type ProyectoMutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Helpers
// =============================================================================

async function checkFundAccess(
  userId: string,
  userRole: string | undefined,
  fondoId: string
): Promise<boolean> {
  if (isSuperAdmin(userRole ?? '')) return true;
  if (!hasRoleOrHigher(userRole ?? '', ROLES.ADMIN_FONDO)) return false;

  const [access] = await db
    .select({ fondoId: userFondos.fondoId })
    .from(userFondos)
    .where(and(eq(userFondos.userId, userId), eq(userFondos.fondoId, fondoId)))
    .limit(1);

  return !!access;
}

// =============================================================================
// Create Proyecto
// =============================================================================

/**
 * Create a new project for a fund.
 *
 * RBAC: admin_fondo+ with fund access
 *
 * @param fondoId - Fund UUID
 * @param input - Project data
 * @returns Result with success or error
 */
export async function createProyecto(
  fondoId: string,
  input: unknown
): Promise<ProyectoMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para crear proyectos en este fondo' };
  }

  // 3. Validate input
  const parsed = createProyectoSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  const {
    codigo,
    nombre,
    descripcion,
    tasaPref,
    successFeePct,
    metodoCascada,
    fechaInicio,
    fechaTerminacion,
  } = parsed.data;

  // 4. Check uniqueness (same fund + project codigo)
  const [existing] = await db
    .select({ id: proyectos.id })
    .from(proyectos)
    .where(and(eq(proyectos.fondoId, fondoId), eq(proyectos.codigo, codigo)))
    .limit(1);

  if (existing) {
    return { error: 'Ya existe un proyecto con ese código en este fondo' };
  }

  try {
    // 5. Create project
    const [newProyecto] = await db
      .insert(proyectos)
      .values({
        fondoId,
        codigo,
        nombre,
        descripcion: descripcion || null,
        tasaPref: tasaPref || '12.00',
        successFeePct: successFeePct || null,
        metodoCascada: metodoCascada || null,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : null,
        fechaTerminacion: fechaTerminacion ? new Date(fechaTerminacion) : null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: proyectos.id });

    // 6. Revalidate cache
    revalidatePath(`/fondos/${fondoId}/proyectos`);

    return { success: true, data: { id: newProyecto.id } };
  } catch (error) {
    console.error('[createProyecto]', error);
    return { error: 'No pudimos crear el proyecto. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Proyecto
// =============================================================================

/**
 * Update an existing project.
 *
 * RBAC: admin_fondo+ with fund access
 *
 * @param id - Project UUID
 * @param input - Project data to update
 * @returns Result with success or error
 */
export async function updateProyecto(id: string, input: unknown): Promise<ProyectoMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Get existing project
  const [existing] = await db
    .select({
      id: proyectos.id,
      fondoId: proyectos.fondoId,
      nombre: proyectos.nombre,
    })
    .from(proyectos)
    .where(eq(proyectos.id, id))
    .limit(1);

  if (!existing) {
    return { error: 'Proyecto no encontrado' };
  }

  // 3. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, existing.fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para editar este proyecto' };
  }

  // 4. Validate input
  const parsed = updateProyectoSchema.safeParse(input);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  // 5. Check uniqueness if nombre changed
  if (parsed.data.nombre && parsed.data.nombre !== existing.nombre) {
    const [duplicate] = await db
      .select({ id: proyectos.id })
      .from(proyectos)
      .where(and(eq(proyectos.fondoId, existing.fondoId), eq(proyectos.nombre, parsed.data.nombre)))
      .limit(1);

    if (duplicate) {
      return { error: 'Ya existe un proyecto con ese nombre en este fondo' };
    }
  }

  try {
    // 6. Update project
    const { fechaInicio, fechaTerminacion, ...restData } = parsed.data;
    await db
      .update(proyectos)
      .set({
        ...restData,
        descripcion: parsed.data.descripcion || null,
        tasaPref: parsed.data.tasaPref || undefined,
        successFeePct: parsed.data.successFeePct || null,
        metodoCascada: parsed.data.metodoCascada || null,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaTerminacion: fechaTerminacion ? new Date(fechaTerminacion) : undefined,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(proyectos.id, id));

    // 7. Revalidate cache
    revalidatePath(`/fondos/${existing.fondoId}/proyectos`);

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateProyecto]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}

// =============================================================================
// Update Proyecto Estado
// =============================================================================

type EstadoProyecto = 'inversion_abierta' | 'inversion_cerrada' | 'concluido';

/** Valid state transitions per BR-008 */
const VALID_TRANSITIONS: Record<EstadoProyecto, EstadoProyecto[]> = {
  inversion_abierta: ['inversion_cerrada'],
  inversion_cerrada: ['concluido', 'inversion_abierta'], // Can reopen
  concluido: [], // Terminal state
};

/**
 * Update project state with transition validation.
 *
 * RBAC: admin_fondo+ with fund access
 * BR-008: Valid transitions only
 *
 * @param id - Project UUID
 * @param nuevoEstado - New state
 * @returns Result with success or error
 */
export async function updateProyectoEstado(
  id: string,
  nuevoEstado: EstadoProyecto
): Promise<ProyectoMutationResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Get existing project
  const [existing] = await db
    .select({
      id: proyectos.id,
      fondoId: proyectos.fondoId,
      estado: proyectos.estado,
    })
    .from(proyectos)
    .where(eq(proyectos.id, id))
    .limit(1);

  if (!existing) {
    return { error: 'Proyecto no encontrado' };
  }

  // 3. RBAC check
  const hasAccess = await checkFundAccess(session.user.id, session.user.role, existing.fondoId);
  if (!hasAccess) {
    return { error: 'No tienes permiso para cambiar el estado de este proyecto' };
  }

  // 4. Validate transition (BR-008)
  const currentEstado = existing.estado as EstadoProyecto;
  const allowedTransitions = VALID_TRANSITIONS[currentEstado] || [];

  if (!allowedTransitions.includes(nuevoEstado)) {
    return {
      error: `No se puede cambiar de "${currentEstado}" a "${nuevoEstado}". Transiciones válidas: ${allowedTransitions.join(', ') || 'ninguna'}`,
    };
  }

  try {
    // 5. Update estado
    await db
      .update(proyectos)
      .set({
        estado: nuevoEstado,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(proyectos.id, id));

    // 6. Revalidate cache
    revalidatePath(`/fondos/${existing.fondoId}/proyectos`);
    revalidatePath(`/fondos/${existing.fondoId}/proyectos/${id}`);

    return { success: true, data: { id } };
  } catch (error) {
    console.error('[updateProyectoEstado]', error);
    return { error: 'No pudimos cambiar el estado. Intenta de nuevo.' };
  }
}
