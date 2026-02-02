'use server';

/**
 * Send Password Reset from Profile
 *
 * Sends password reset email directly from profile page.
 * Returns immediately with toast, email sent in background.
 */

import { auth } from '@/lib/auth';
import { requestPasswordReset } from '@/lib/auth/password-reset';

export interface SendResetEmailResult {
  success?: boolean;
  error?: string;
}

export async function sendPasswordResetEmail(): Promise<SendResetEmailResult> {
  const session = await auth();

  if (!session?.user?.email) {
    return { error: 'No se encontró tu email' };
  }

  try {
    await requestPasswordReset(session.user.email);
    return { success: true };
  } catch (error) {
    console.error('[sendPasswordResetEmail]', error);
    return { error: 'No pudimos enviar el email. Intenta de nuevo.' };
  }
}
