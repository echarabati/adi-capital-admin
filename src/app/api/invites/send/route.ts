/**
 * Send Invite API Endpoint
 *
 * POST /api/invites/send
 *
 * Creates an invite and sends the email.
 * For now, requires super_admin or dev mode.
 */

import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/lib/auth/auth';
import { isSuperAdmin } from '@/config/roles';
import { createInviteToken } from '@/lib/invites';
import { sendEmail, inviteUserEmail, inviteUserEmailText } from '@/lib/email';
import { getEnv, isEmailConfigured } from '@/lib/env';
import { logger } from '@/lib/logger';

interface SendInviteBody {
  email: string;
}

function validateBody(body: unknown): body is SendInviteBody {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return typeof b.email === 'string' && b.email.includes('@');
}

export async function POST(request: NextRequest) {
  try {
    // Check authorization (super_admin or dev mode)
    const session = await auth();
    const isDev = process.env.NODE_ENV === 'development';
    const isAuthorized = isDev || (session?.user?.email && isSuperAdmin(session.user.email));

    if (!isAuthorized) {
      return NextResponse.json(
        { error: 'Unauthorized', message: 'Requiere super_admin o modo dev' },
        { status: 401 }
      );
    }

    const body = await request.json();

    if (!validateBody(body)) {
      return NextResponse.json(
        { error: 'invalid_request', message: 'Email requerido' },
        { status: 400 }
      );
    }

    const { email } = body;
    // Use name, or email username, or fallback to 'El equipo'
    const inviterName =
      session?.user?.name ||
      (session?.user?.email ? session.user.email.split('@')[0] : null) ||
      'El equipo';

    // Create invite token
    const { token, invite } = await createInviteToken(email, session?.user?.id || undefined);

    // Build accept URL
    const appUrl = getEnv().NEXT_PUBLIC_APP_URL || 'http://localhost:3000';
    const acceptUrl = `${appUrl}/accept-invite?token=${token}`;

    // Check if email is configured
    if (!isEmailConfigured()) {
      // Return token directly for manual testing
      logger.warn('[Send Invite] Email not configured, returning token for manual testing');
      return NextResponse.json({
        success: true,
        message: 'Email no configurado. Usa el link directamente:',
        acceptUrl,
        invite: {
          id: invite.id,
          email: invite.email,
          expiresAt: invite.expiresAt,
        },
      });
    }

    // Send email
    const appName = getEnv().NEXT_PUBLIC_APP_NAME || 'App';
    const result = await sendEmail({
      to: email,
      subject: `Te han invitado a ${appName}`,
      html: inviteUserEmail({ url: acceptUrl, inviterName }),
      text: inviteUserEmailText({ url: acceptUrl, inviterName }),
    });

    if (!result.success) {
      logger.error('[Send Invite] Email failed:', result.error);
      return NextResponse.json({
        success: false,
        error: 'email_failed',
        message: 'Error al enviar email. Token creado, puedes usar el link:',
        acceptUrl,
      });
    }

    logger.info('[Send Invite] Invite sent', { to: email, inviteId: invite.id });

    return NextResponse.json({
      success: true,
      message: `Invitación enviada a ${email}`,
      invite: {
        id: invite.id,
        email: invite.email,
        expiresAt: invite.expiresAt,
      },
    });
  } catch (error) {
    logger.error('[Send Invite] Error:', error);
    return NextResponse.json(
      { error: 'server_error', message: 'Error del servidor' },
      { status: 500 }
    );
  }
}
