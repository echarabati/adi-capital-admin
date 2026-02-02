'use server';

/**
 * Change Password Action
 *
 * Allows users to change their password in-place without email.
 * Requires current password verification.
 */

import { revalidatePath } from 'next/cache';
import { eq } from 'drizzle-orm';
import { z } from 'zod';
import { auth } from '@/lib/auth';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { hashPassword, verifyPassword } from '@/lib/auth/utils';

const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'La contraseña actual es requerida'),
    newPassword: z.string().min(8, 'La nueva contraseña debe tener al menos 8 caracteres'),
    confirmPassword: z.string().min(1, 'Confirma la nueva contraseña'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Las contraseñas no coinciden',
    path: ['confirmPassword'],
  });

export interface ChangePasswordResult {
  success?: boolean;
  error?: string;
}

export async function changePassword(formData: FormData): Promise<ChangePasswordResult> {
  // 1. Auth check
  const session = await auth();
  if (!session?.user?.id) {
    return { error: 'Debes iniciar sesión' };
  }

  // 2. Validate input
  const rawData = {
    currentPassword: formData.get('currentPassword'),
    newPassword: formData.get('newPassword'),
    confirmPassword: formData.get('confirmPassword'),
  };

  const parsed = changePasswordSchema.safeParse(rawData);
  if (!parsed.success) {
    const firstError = parsed.error.issues[0];
    return { error: firstError?.message || 'Datos inválidos' };
  }

  try {
    // 3. Get current user with password
    const user = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { password: true },
    });

    if (!user?.password) {
      return { error: 'Tu cuenta no tiene contraseña (OAuth)' };
    }

    // 4. Verify current password
    const isValid = await verifyPassword(parsed.data.currentPassword, user.password);
    if (!isValid) {
      return { error: 'La contraseña actual es incorrecta' };
    }

    // 5. Hash new password
    const hashedPassword = await hashPassword(parsed.data.newPassword);

    // 6. Update password
    await db
      .update(users)
      .set({
        password: hashedPassword,
        modifiedAt: new Date(),
        modifiedBy: session.user.id,
      })
      .where(eq(users.id, session.user.id));

    // 7. Revalidate
    revalidatePath('/settings/profile');

    return { success: true };
  } catch (error) {
    console.error('[changePassword]', error);
    return { error: 'No pudimos cambiar la contraseña. Intenta de nuevo.' };
  }
}
