/**
 * NextAuth.js v5 Configuration
 *
 * Complete authentication setup with:
 * - Credentials (password)
 * - Magic Link (email)
 * - OAuth (Google, GitHub)
 *
 * Just configure .env.local and use!
 *
 * @see ADR-007: Auth Framework Design
 */

import { logger } from '@/lib/logger';

import NextAuth from 'next-auth';
import type { User, Account, Session, Profile } from 'next-auth';
import type { JWT } from 'next-auth/jwt';
import type { AdapterUser } from 'next-auth/adapters';
import Credentials from 'next-auth/providers/credentials';
import Google from 'next-auth/providers/google';
import GitHub from 'next-auth/providers/github';
import Email from 'next-auth/providers/email';

import { sendEmail, isEmailReady } from '@/lib/email';
import { magicLinkEmail, magicLinkEmailText } from '@/lib/email/templates/magic-link';
import { DrizzleAdapter } from '@auth/drizzle-adapter';
import { eq } from 'drizzle-orm';

import { db } from '@/lib/db/drizzle';
import { isDatabaseConfigured } from '@/lib/env';
import { users, accounts, sessions, verificationTokens } from '@/lib/db/schema';
import { authFeatures, getGoogleCredentials, getGitHubCredentials } from '@/config/auth-features';
import { getDefaultRole } from '@/config/roles';
import { logAuditEvent } from '@/lib/audit';
import { hashPassword, verifyPassword } from './utils';

// =============================================================================
// Drizzle Adapter (conditional)
// =============================================================================

/**
 * Create Drizzle adapter only when DATABASE_URL is configured.
 * This allows the app to build without a database connection.
 */
function createAdapter() {
  if (!isDatabaseConfigured()) {
    logger.warn('DATABASE_URL not configured. Auth adapter disabled.');
    return undefined;
  }

  return DrizzleAdapter(db, {
    usersTable: users,
    accountsTable: accounts,
    sessionsTable: sessions,
    verificationTokensTable: verificationTokens,
  });
}

// =============================================================================
// NextAuth Configuration
// =============================================================================

/**
 * Generate unique cookie name per project
 * This prevents cookie conflicts when running multiple Next.js projects on localhost
 */
const cookieName = process.env.NEXT_PUBLIC_APP_NAME?.toLowerCase().replace(/\s+/g, '-') || 'app';

export const { handlers, signIn, signOut, auth } = NextAuth({
  // Trust host for local production testing (AUTH_TRUST_HOST env var)
  trustHost: process.env.AUTH_TRUST_HOST === 'true',

  // Drizzle adapter for database sessions (only when configured)
  adapter: createAdapter(),

  // Use JWT for sessions (works better with credentials)
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },

  // ✅ Unique cookies per project (multi-project dev support)
  cookies: {
    sessionToken: {
      name: `authjs.session-token.${cookieName}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    csrfToken: {
      name: `authjs.csrf-token.${cookieName}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
    callbackUrl: {
      name: `authjs.callback-url.${cookieName}`,
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
      },
    },
  },

  // Custom pages
  pages: {
    signIn: '/login',
    error: '/error', // Custom error page (auth group)
    // signOut: '/logout',
    // verifyRequest: '/auth/verify',
    // newUser: '/auth/new-user',
  },

  // =============================================================================
  // Providers
  // =============================================================================
  providers: [
    // -------------------------------------------------------------------------
    // Credentials Provider (Password)
    // -------------------------------------------------------------------------
    ...(authFeatures.providers.credentials
      ? [
          Credentials({
            name: 'credentials',
            credentials: {
              email: { label: 'Email', type: 'email' },
              password: { label: 'Password', type: 'password' },
            },
            async authorize(credentials: Record<string, unknown> | undefined) {
              if (!credentials?.email || !credentials?.password) {
                return null;
              }

              // Check if database is configured
              if (!isDatabaseConfigured()) {
                logger.error('Credentials login requires DATABASE_URL');
                return null;
              }

              const email = (credentials.email as string).toLowerCase();
              const password = credentials.password as string;

              // Regular user login
              const user = await db.query.users.findFirst({
                where: eq(users.email, email),
              });

              if (!user || !user.password) {
                return null;
              }

              const isValid = await verifyPassword(password, user.password);
              if (!isValid) {
                return null;
              }

              return {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
              };
            },
          }),
        ]
      : []),

    // -------------------------------------------------------------------------
    // Google OAuth (only if configured)
    // -------------------------------------------------------------------------
    ...(authFeatures.providers.google
      ? [
          (() => {
            const { clientId, clientSecret } = getGoogleCredentials();
            return Google({
              clientId,
              clientSecret,
              // Allow linking OAuth to existing email accounts
              allowDangerousEmailAccountLinking: true,
              profile(profile) {
                return {
                  id: profile.sub,
                  name: profile.name,
                  email: profile.email,
                  image: profile.picture,
                };
              },
            });
          })(),
        ]
      : []),

    // -------------------------------------------------------------------------
    // GitHub OAuth (only if configured)
    // -------------------------------------------------------------------------
    ...(authFeatures.providers.github
      ? [
          (() => {
            const { clientId, clientSecret } = getGitHubCredentials();
            return GitHub({
              clientId,
              clientSecret,
              // Allow linking OAuth to existing email accounts
              allowDangerousEmailAccountLinking: true,
            });
          })(),
        ]
      : []),

    // -------------------------------------------------------------------------
    // Email (Magic Link) - Uses SMTP (custom or Resend's SMTP gateway)
    // -------------------------------------------------------------------------
    ...(authFeatures.providers.email && isEmailReady()
      ? [
          (() => {
            // Build SMTP server config based on EMAIL_PROVIDER
            const emailProvider = process.env.EMAIL_PROVIDER;
            let serverConfig;

            if (emailProvider === 'resend') {
              // Resend SMTP gateway
              serverConfig = {
                host: 'smtp.resend.com',
                port: 465,
                secure: true,
                auth: {
                  user: 'resend',
                  pass: process.env.RESEND_API_KEY || '',
                },
              };
            } else if (emailProvider === 'smtp') {
              // Custom SMTP config
              serverConfig = {
                host: process.env.EMAIL_SERVER_HOST || '',
                port: Number(process.env.EMAIL_SERVER_PORT) || 587,
                secure: process.env.EMAIL_SERVER_SECURE === 'true',
                auth: process.env.EMAIL_SERVER_USER
                  ? {
                      user: process.env.EMAIL_SERVER_USER,
                      pass: process.env.EMAIL_SERVER_PASSWORD || '',
                    }
                  : undefined,
              };
            } else {
              // Fallback (shouldn't reach here due to isEmailReady check)
              return null;
            }

            return Email({
              server: serverConfig,
              from: process.env.EMAIL_FROM || 'noreply@example.com',
              sendVerificationRequest: async ({ identifier: email, url, provider }) => {
                const host = new URL(url).host;
                const result = await sendEmail({
                  to: email,
                  subject: `Inicia sesión en ${process.env.NEXT_PUBLIC_APP_NAME || 'App'}`,
                  html: magicLinkEmail({ url, host }),
                  text: magicLinkEmailText({ url, host }),
                });
                if (!result.success) {
                  logger.error('[Magic Link] Failed to send:', result.error);
                  throw new Error(`Email(${provider.from}) could not be sent`);
                }
              },
            });
          })(),
        ].filter((p): p is NonNullable<typeof p> => p !== null)
      : []),
  ],

  // =============================================================================
  // Callbacks
  // =============================================================================
  callbacks: {
    /**
     * JWT callback - Add custom fields to token
     */
    async jwt({
      token,
      user,
      trigger,
      session,
    }: {
      token: JWT;
      user?: User | AdapterUser;
      trigger?: 'signIn' | 'signUp' | 'update';
      session?: { role?: string };
    }) {
      // Initial sign in
      if (user) {
        token.id = user.id;
        token.role = user.role || getDefaultRole();
      }

      // Handle session updates
      if (trigger === 'update' && session) {
        token.role = session.role;
      }

      return token;
    },

    /**
     * Session callback - Expose custom fields to client
     */
    async session({ session, token }: { session: Session; token: JWT }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as string;
      }
      return session;
    },

    /**
     * Sign in callback - Handle OAuth user creation
     */
    async signIn({
      user,
      account,
      profile,
    }: {
      user: User | AdapterUser;
      account?: Account | null;
      profile?: Profile;
    }) {
      // Skip if no database
      if (!isDatabaseConfigured()) {
        return true;
      }

      // For OAuth providers, check/set role and sync profile data
      if (account?.provider !== 'credentials' && user.email) {
        const existingUser = await db.query.users.findFirst({
          where: eq(users.email, user.email),
        });

        if (existingUser) {
          // Sync Name if missing
          // If user has no name in DB, but we got one from OAuth, update it
          if (!existingUser.name && profile?.name) {
            await db
              .update(users)
              .set({ name: profile.name as string })
              .where(eq(users.id, existingUser.id));
            logger.info(`[Auth] Synced name for user ${user.email} from ${account?.provider}`);
          }
        }
      }

      return true;
    },
  },

  // =============================================================================
  // Events
  // =============================================================================
  events: {
    /**
     * Sign in event - Log successful logins
     */
    async signIn({ user, account }: { user: User; account?: Account | null }) {
      if (user.email && user.id) {
        await logAuditEvent({
          event: 'login_success',
          userId: user.id,
          email: user.email,
          metadata: { provider: account?.provider || 'credentials' },
        });
      }
    },

    /**
     * Create user event - Set default role for new users
     */
    async createUser({ user }: { user: User }) {
      // Skip if no database
      if (!isDatabaseConfigured()) {
        return;
      }

      if (user.email && user.id) {
        const role = getDefaultRole();

        await db.update(users).set({ role }).where(eq(users.id, user.id));

        // Log account creation
        await logAuditEvent({
          event: 'account_created',
          userId: user.id,
          email: user.email,
        });
      }
    },
  },

  // Debug mode (opt-in via AUTH_DEBUG=true)
  debug: process.env.AUTH_DEBUG === 'true',
});

// =============================================================================
// Helper Exports
// =============================================================================

export { hashPassword, verifyPassword };
