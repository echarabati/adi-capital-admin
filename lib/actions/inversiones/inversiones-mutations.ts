'use server';

/**
 * Inversiones Mutations
 *
 * Server actions for creating and updating inversiones.
 *
 * @see INVE-002
 */

import { eq, and } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { inversiones, inversionistasFondos, proyectos } from '@/lib/db/schema';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import {
  createInversionSchema,
  CreateInversionInput,
} from '@/lib/validations/inversiones/inversion-validation';

// =============================================================================
// Types
// =============================================================================

type MutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Create Inversion
// =============================================================================

/**
 * Create a new inversión linking an investor to a project.
 *
 * BR-013: Validates inversionista belongs to proyecto's fondo.
 *
 * @param proyectoId - Project UUID
 * @param input - Form data
 * @returns Success/error result
 */
export async function createInversion(
  proyectoId: string,
  input: CreateInversionInput
): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  const userRole = session.user.role;

  // Check permissions
  if (!isSuperAdmin(userRole) && !hasRoleOrHigher(userRole, ROLES.ADMIN_FONDO)) {
    return { error: 'No tienes permiso para crear inversiones' };
  }

  // Validate input
  const parsed = createInversionSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Datos inválidos' };
  }

  const data = parsed.data;

  try {
    // Get proyecto and its fondo
    const [proyecto] = await db
      .select({ id: proyectos.id, fondoId: proyectos.fondoId })
      .from(proyectos)
      .where(eq(proyectos.id, proyectoId))
      .limit(1);

    if (!proyecto) {
      return { error: 'Proyecto no encontrado' };
    }

    // BR-013: Validate inversionista belongs to proyecto's fondo
    const [inversionistaInFondo] = await db
      .select({ inversionistaId: inversionistasFondos.inversionistaId })
      .from(inversionistasFondos)
      .where(
        and(
          eq(inversionistasFondos.inversionistaId, data.inversionistaId),
          eq(inversionistasFondos.fondoId, proyecto.fondoId)
        )
      )
      .limit(1);

    if (!inversionistaInFondo) {
      return { error: 'El inversionista no pertenece al fondo de este proyecto' };
    }

    // Check if inversión already exists
    const [existingInversion] = await db
      .select({ id: inversiones.id })
      .from(inversiones)
      .where(
        and(
          eq(inversiones.inversionistaId, data.inversionistaId),
          eq(inversiones.proyectoId, proyectoId)
        )
      )
      .limit(1);

    if (existingInversion) {
      return { error: 'Ya existe una inversión de este inversionista en este proyecto' };
    }

    // Insert inversión
    const [newInversion] = await db
      .insert(inversiones)
      .values({
        inversionistaId: data.inversionistaId,
        proyectoId,
        compromiso: data.compromiso,
        prefRate: data.prefRate || null,
        successFeePct: data.successFeePct || null,
        adminFeeTipo: data.adminFeeTipo || null,
        adminFeePct: data.adminFeePct || null,
        adminFeeBase: data.adminFeeBase || null,
        adminFeeMetodo: data.adminFeeMetodo || null,
        notas: data.notas || null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: inversiones.id });

    // Revalidate paths
    revalidatePath(`/fondos/[id]/proyectos/[proyectoId]/inversiones`, 'page');
    revalidatePath(`/inversionistas/[id]/inversiones`, 'page');

    return { success: true, data: { id: newInversion.id } };
  } catch (error) {
    console.error('[createInversion]', error);
    return { error: 'No pudimos crear la inversión. Intenta de nuevo.' };
  }
}
