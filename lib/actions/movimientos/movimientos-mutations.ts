'use server';

/**
 * Movimientos Mutations
 *
 * Server actions for creating and updating movimientos.
 *
 * @see MOV-002
 */

import { eq } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { movimientos, fondos } from '@/lib/db/schema';
import { isSuperAdmin, hasRoleOrHigher, ROLES } from '@/src/config/roles';
import {
  createMovimientoSchema,
  CreateMovimientoInput,
} from '@/lib/validations/movimientos/movimientos-validation';

// =============================================================================
// Types
// =============================================================================

type MutationResult = {
  success?: boolean;
  error?: string;
  data?: { id: string };
};

// =============================================================================
// Create Movimiento
// =============================================================================

/**
 * Create a new movimiento (financial movement).
 *
 * Creates in 'borrador' (draft) state.
 * Calculates monto_usd if tipoCambio is provided.
 *
 * @param input - Form data
 * @returns Success/error result
 */
export async function createMovimiento(input: CreateMovimientoInput): Promise<MutationResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  const userRole = session.user.role;

  // Check permissions
  if (!isSuperAdmin(userRole) && !hasRoleOrHigher(userRole, ROLES.ADMIN_FONDO)) {
    return { error: 'No tienes permiso para crear movimientos' };
  }

  // Validate input
  const parsed = createMovimientoSchema.safeParse(input);
  if (!parsed.success) {
    const errors = parsed.error.flatten();
    const firstError = Object.values(errors.fieldErrors)[0]?.[0] || 'Datos inválidos';
    return { error: firstError };
  }

  const data = parsed.data;

  try {
    // Verify fondo exists
    const [fondo] = await db
      .select({ id: fondos.id, monedaBase: fondos.monedaBase })
      .from(fondos)
      .where(eq(fondos.id, data.fondoId))
      .limit(1);

    if (!fondo) {
      return { error: 'Fondo no encontrado' };
    }

    // Calculate monto_usd if different currency and tipoCambio provided
    let montoUsd: string | null = null;
    const monto = parseFloat(data.monto);

    if (data.moneda === 'USD') {
      montoUsd = data.monto;
    } else if (data.tipoCambio) {
      const tc = parseFloat(data.tipoCambio);
      if (tc > 0) {
        montoUsd = (monto / tc).toFixed(2);
      }
    }

    // Insert movimiento
    const [newMovimiento] = await db
      .insert(movimientos)
      .values({
        fondoId: data.fondoId,
        concepto: data.concepto,
        monto: data.monto,
        moneda: data.moneda,
        tipoCambio: data.tipoCambio || null,
        montoUsd,
        estado: 'borrador',
        fechaMovimiento: new Date(data.fechaMovimiento),
        descripcion: data.descripcion || null,
        proyectoId: data.proyectoId || null,
        inversionistaId: data.inversionistaId || null,
        inversionId: data.inversionId || null,
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: movimientos.id });

    // Revalidate paths
    revalidatePath('/movimientos', 'page');

    return { success: true, data: { id: newMovimiento.id } };
  } catch (error) {
    console.error('[createMovimiento]', error);
    return { error: 'No pudimos crear el movimiento. Intenta de nuevo.' };
  }
}
