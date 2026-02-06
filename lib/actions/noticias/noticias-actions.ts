'use server';

/**
 * Noticias Actions
 *
 * Server actions for creating and managing news.
 *
 * @see NEWS-001
 */

import { z } from 'zod';
import { db } from '@/lib/db/drizzle';
import { noticias } from '@/lib/db/schema';
import { auth } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// =============================================================================
// Validation Schema
// =============================================================================

const CreateNoticiaSchema = z.object({
  titulo: z.string().min(1, 'El título es requerido').max(200),
  contenido: z.string().min(1, 'El contenido es requerido'),
  imagenUrl: z.string().url('URL de imagen inválida').optional().or(z.literal('')),
  fondoId: z.string().uuid().optional().nullable(),
});

export type CreateNoticiaInput = z.infer<typeof CreateNoticiaSchema>;

// =============================================================================
// Create Noticia
// =============================================================================

/**
 * Create a new noticia (news item).
 *
 * - fondoId = null → General news (visible to all)
 * - fondoId = UUID → Fund-specific news
 *
 * @param input - Noticia data
 * @returns Created noticia ID or error
 */
export async function createNoticia(input: unknown) {
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // Validate input
  const parsed = CreateNoticiaSchema.safeParse(input);
  if (!parsed.success) {
    return { error: 'Datos inválidos', details: parsed.error.flatten() };
  }

  const { titulo, contenido, imagenUrl, fondoId } = parsed.data;

  try {
    const [noticia] = await db
      .insert(noticias)
      .values({
        titulo,
        contenido,
        imagenUrl: imagenUrl || null,
        fondoId: fondoId || null,
        estado: 'borrador',
        createdBy: session.user.id,
        modifiedBy: session.user.id,
      })
      .returning({ id: noticias.id });

    revalidatePath('/noticias');

    return { success: true, id: noticia.id };
  } catch (error) {
    console.error('[createNoticia]', error);
    return { error: 'No pudimos crear la noticia. Intenta de nuevo.' };
  }
}
