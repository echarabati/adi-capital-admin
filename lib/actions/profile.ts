'use server';

/**
 * Profile Server Actions
 *
 * Server-side actions for user profile management.
 */

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { profileSchema } from '@/lib/validations/profile';

export interface UpdateProfileResult {
  success?: boolean;
  error?: string;
}

/**
 * Update the current user's profile.
 *
 * @param formData - Form data containing name field
 * @returns Result object with success or error
 */
export async function updateProfile(formData: FormData): Promise<UpdateProfileResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Validate input
  const rawData = {
    name: formData.get('name'),
  };

  const parsed = profileSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  try {
    // 3. Update user
    await db
      .update(users)
      .set({
        name: parsed.data.name,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(users.id, session.user.id));

    // 4. Revalidate cache
    revalidatePath('/settings/profile');

    return { success: true };
  } catch (error) {
    console.error('[updateProfile]', error);
    return { error: 'No pudimos guardar los cambios. Intenta de nuevo.' };
  }
}
