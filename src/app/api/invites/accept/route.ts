/**
 * Accept Invite API Endpoint
 *
 * POST /api/invites/accept
 *
 * Accepts an invitation and creates a new user account.
 */

import { NextRequest, NextResponse } from 'next/server';
import { eq } from 'drizzle-orm';
import { db } from '@/lib/db/drizzle';
import { users } from '@/lib/db/schema';
import { validateInviteToken, markInviteAsAccepted } from '@/lib/invites';
import { hashPassword } from '@/lib/auth/auth';
import { logger } from '@/lib/logger';

// Schema validation
interface AcceptInviteBody {
  token: string;
  name: string;
  password: string;
}

function validateBody(body: unknown): body is AcceptInviteBody {
  if (!body || typeof body !== 'object') return false;
  const b = body as Record<string, unknown>;
  return (
    typeof b.token === 'string' &&
    b.token.length > 0 &&
    typeof b.name === 'string' &&
    b.name.length > 0 &&
    typeof b.password === 'string' &&
    b.password.length >= 8
  );
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validate request body
    if (!validateBody(body)) {
      return NextResponse.json(
        {
          error: 'invalid_request',
          message: 'Token, nombre y contraseña (mín. 8 caracteres) son requeridos',
        },
        { status: 400 }
      );
    }

    const { token, name, password } = body;

    // Validate the invite token
    const validation = await validateInviteToken(token);

    if (!validation.valid || !validation.invite) {
      return NextResponse.json(
        {
          error: 'invalid_token',
          message: validation.error || 'Token de invitación inválido',
        },
        { status: 400 }
      );
    }

    const invite = validation.invite;

    // Check if user already exists with this email
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, invite.email))
      .limit(1);

    if (existingUser) {
      // User already exists - mark invite as accepted and redirect to login
      await markInviteAsAccepted(token);
      return NextResponse.json(
        {
          error: 'user_exists',
          message: 'Ya existe una cuenta con este email. Por favor inicia sesión.',
        },
        { status: 400 }
      );
    }

    // Hash the password
    const hashedPassword = await hashPassword(password);

    // Create the user
    const [newUser] = await db
      .insert(users)
      .values({
        email: invite.email,
        name,
        password: hashedPassword,
        emailVerified: new Date(), // Email is verified since they received the invite
        role: 'user',
      })
      .returning();

    // Mark invite as accepted
    await markInviteAsAccepted(token);

    logger.info('[Accept Invite] User created from invite', {
      userId: newUser.id,
      email: invite.email,
      invitedBy: invite.invitedBy,
    });

    // Return success - client will handle sign in
    return NextResponse.json({
      success: true,
      message: 'Cuenta creada exitosamente',
      userId: newUser.id,
      email: invite.email,
    });
  } catch (error) {
    logger.error('[Accept Invite] Error:', error);
    return NextResponse.json(
      {
        error: 'server_error',
        message: 'Error del servidor. Inténtalo más tarde.',
      },
      { status: 500 }
    );
  }
}
