/**
 * Login Form Component — Premium Design
 *
 * Authentication form with support for multiple providers.
 * Features:
 * - Premium card design with logo
 * - Theme-aware (light/midnight/dark)
 * - Email/Password, Magic Link, Google OAuth
 * - Toast notifications
 * - Loading states with spinners
 *
 * @see ADR-007: Auth Framework Design
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { signIn } from 'next-auth/react';
import { toast } from 'sonner';
import { authFeatures } from '@/config/auth-features';
import { branding } from '@/config/branding';
import { useTheme } from 'next-themes';
import { Loader2 } from 'lucide-react';

interface LoginFormProps {
  callbackUrl?: string;
  error?: string;
  defaultEmail?: string;
}

export function LoginForm({ callbackUrl = '/', error, defaultEmail = '' }: LoginFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(error || null);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Get theme-aware logo (use light for SSR to prevent flash)
  const currentTheme = mounted ? resolvedTheme : 'light';
  const clientLogo = branding.getClientLogo(currentTheme);
  const timeKastLogo = branding.getTimeKastLogo('icon', currentTheme);
  const logoSrc = clientLogo || timeKastLogo;

  const handleCredentialsSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError(null);

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      });

      if (result?.error) {
        toast.error('Credenciales inválidas', {
          description: 'Verifica tu email y contraseña',
        });
      } else if (result?.url) {
        toast.success('¡Bienvenido!');
        window.location.href = result.url;
      }
    } catch {
      toast.error('Error al iniciar sesión', {
        description: 'Intenta de nuevo más tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleMagicLink = async () => {
    if (!email) {
      toast.error('Email requerido', {
        description: 'Ingresa tu email para recibir el enlace mágico',
      });
      return;
    }

    setIsLoading(true);
    setFormError(null);

    try {
      await signIn('email', {
        email,
        redirect: false,
        callbackUrl,
      });
      toast.success('¡Revisa tu email!', {
        description: 'Te enviamos un enlace para iniciar sesión',
      });
    } catch {
      toast.error('Error al enviar el enlace', {
        description: 'Intenta de nuevo más tarde',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleOAuth = async (provider: 'google' | 'github') => {
    setIsLoading(true);
    await signIn(provider, { callbackUrl });
  };

  return (
    <div className="bg-card w-full max-w-md rounded-2xl p-8 shadow-lg">
      {/* Logo & Header */}
      <div className="mb-8 text-center">
        <div className="relative mx-auto mb-4 h-20 w-full max-w-[280px]">
          <Image
            src={logoSrc}
            alt="Logo"
            fill
            className="object-contain"
            priority
            sizes="(max-width: 768px) 100vw, 280px"
          />
        </div>
        <h1 className="text-card-foreground text-2xl font-bold">
          {clientLogo ? '' : branding.appName}
        </h1>
        {branding.appTagline && (
          <p className="text-muted-foreground mt-1 text-sm">{branding.appTagline}</p>
        )}
      </div>

      {/* Error message */}
      {formError && (
        <div className="bg-error/10 border-error/20 text-error mb-4 rounded-lg border p-3 text-sm">
          {formError}
        </div>
      )}

      {/* Credentials Form */}
      {authFeatures.providers.credentials && (
        <form onSubmit={handleCredentialsSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="text-card-foreground mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="border-input-border bg-input-bg text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          <div>
            <label
              htmlFor="password"
              className="text-card-foreground mb-2 block text-sm font-medium"
            >
              Contraseña
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading}
              className="border-input-border bg-input-bg text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          {authFeatures.features.passwordReset && (
            <div className="text-right">
              <Link
                href={`/forgot-password${email ? `?email=${encodeURIComponent(email)}` : ''}`}
                className={`text-primary text-sm hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
              >
                ¿Olvidaste tu contraseña?
              </Link>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Iniciar Sesión'}
          </button>
        </form>
      )}

      {/* Magic Link only mode */}
      {authFeatures.providers.email && !authFeatures.providers.credentials && (
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="text-card-foreground mb-2 block text-sm font-medium">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="tu@email.com"
              required
              disabled={isLoading}
              className="border-input-border bg-input-bg text-card-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-3 focus:ring-2 focus:outline-none disabled:opacity-50"
            />
          </div>

          <button
            type="button"
            onClick={handleMagicLink}
            disabled={isLoading}
            className="bg-primary text-primary-foreground hover:bg-primary-hover flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold transition-colors disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : 'Enviar enlace mágico'}
          </button>
        </div>
      )}

      {/* Divider before alternative methods */}
      {(authFeatures.providers.email ||
        authFeatures.providers.google ||
        authFeatures.providers.github) &&
        authFeatures.providers.credentials && (
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="border-card-border w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card text-muted-foreground px-3">O continúa con</span>
            </div>
          </div>
        )}

      {/* Alternative methods: Magic Link + OAuth */}
      {authFeatures.providers.credentials &&
        (authFeatures.providers.email ||
          authFeatures.providers.google ||
          authFeatures.providers.github) && (
          <div className="space-y-3">
            {/* Magic link button */}
            {authFeatures.providers.email && (
              <button
                type="button"
                onClick={handleMagicLink}
                disabled={isLoading}
                className="border-card-border bg-card hover:bg-secondary flex w-full items-center justify-center gap-2 rounded-lg border px-4 py-3 font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <MagicLinkIcon />}
                <span>{isLoading ? 'Enviando...' : 'Enviar enlace mágico'}</span>
              </button>
            )}

            {/* Google */}
            {authFeatures.providers.google && (
              <button
                type="button"
                onClick={() => handleOAuth('google')}
                disabled={isLoading}
                className="border-card-border bg-card hover:bg-secondary flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GoogleIcon />}
                <span>Continuar con Google</span>
              </button>
            )}

            {/* GitHub */}
            {authFeatures.providers.github && (
              <button
                type="button"
                onClick={() => handleOAuth('github')}
                disabled={isLoading}
                className="border-card-border bg-card hover:bg-secondary flex w-full items-center justify-center gap-3 rounded-lg border px-4 py-3 font-medium transition-colors disabled:opacity-50"
              >
                {isLoading ? <Loader2 className="h-5 w-5 animate-spin" /> : <GitHubIcon />}
                <span>Continuar con GitHub</span>
              </button>
            )}
          </div>
        )}

      {/* Registration link */}
      {authFeatures.features.registration && (
        <p className="text-muted-foreground mt-6 text-center text-sm">
          ¿No tienes cuenta?{' '}
          <Link
            href="/register"
            className={`text-primary hover:underline ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
          >
            Regístrate
          </Link>
        </p>
      )}

      {/* Legal consent */}
      <p className="text-muted-foreground mt-6 text-center text-xs">
        Al continuar, aceptas nuestros{' '}
        <Link href="/terms" className="text-primary hover:underline">
          Términos de Servicio
        </Link>{' '}
        y{' '}
        <Link href="/privacy" className="text-primary hover:underline">
          Política de Privacidad
        </Link>
        .
      </p>
    </div>
  );
}

// =============================================================================
// Icons
// =============================================================================

function GoogleIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24">
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}

function GitHubIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
    </svg>
  );
}

function MagicLinkIcon() {
  return (
    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71" />
      <path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71" />
    </svg>
  );
}
