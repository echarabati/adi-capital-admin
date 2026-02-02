/**
 * Forgot Password Form Component
 *
 * Premium design matching LoginForm.
 * Features:
 * - Theme-aware logo
 * - Toast notifications
 * - Success state with instructions
 */

'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { toast } from 'sonner';
import { branding } from '@/config/branding';
import { useTheme } from 'next-themes';
import { Mail, ArrowLeft, Loader2 } from 'lucide-react';

interface ForgotPasswordFormProps {
  defaultEmail?: string;
}

export function ForgotPasswordForm({ defaultEmail = '' }: ForgotPasswordFormProps) {
  const [email, setEmail] = useState(defaultEmail);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  const logoSrc = branding.getTimeKastLogo('icon', mounted ? resolvedTheme : 'light');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Email requerido');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (response.ok) {
        setIsSubmitted(true);
        toast.success('¡Revisa tu email!', {
          description:
            'Si existe una cuenta, recibirás instrucciones para restablecer tu contraseña.',
        });
      } else {
        toast.error('Error al procesar la solicitud', {
          description: data.error || 'Intenta de nuevo más tarde',
        });
      }
    } catch {
      toast.error('Error de conexión', {
        description: 'Verifica tu conexión a internet',
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Success state
  if (isSubmitted) {
    return (
      <div className="bg-background flex min-h-screen items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="bg-card border-border rounded-2xl border p-8 text-center shadow-xl">
            {/* Logo */}
            <div className="mb-6 flex justify-center">
              <div className="bg-primary/10 relative h-16 w-16 rounded-xl p-3">
                <Image
                  src={logoSrc}
                  alt={branding.appName}
                  fill
                  priority
                  className="object-contain p-2"
                />
              </div>
            </div>

            {/* Success Icon */}
            <div className="bg-success/10 mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full">
              <Mail className="text-success h-6 w-6" />
            </div>

            <h1 className="text-foreground mb-2 text-xl font-semibold">¡Revisa tu email!</h1>
            <p className="text-muted-foreground mb-6 text-sm">
              Si existe una cuenta con <strong>{email}</strong>, recibirás un enlace para
              restablecer tu contraseña.
            </p>
            <p className="text-muted-foreground mb-6 text-xs">El enlace expira en 1 hora.</p>

            <Link
              href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className="text-primary inline-flex items-center gap-2 text-sm hover:underline"
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Form state
  return (
    <div className="bg-background flex min-h-screen items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-card border-border rounded-2xl border p-8 shadow-xl">
          {/* Logo */}
          <div className="mb-6 flex justify-center">
            <div className="bg-primary/10 relative h-16 w-16 rounded-xl p-3">
              <Image
                src={logoSrc}
                alt={branding.appName}
                fill
                priority
                className="object-contain p-2"
              />
            </div>
          </div>

          {/* Header */}
          <div className="mb-6 text-center">
            <h1 className="text-foreground mb-2 text-2xl font-bold">¿Olvidaste tu contraseña?</h1>
            <p className="text-muted-foreground text-sm">
              Ingresa tu email y te enviaremos un enlace para restablecer tu contraseña.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="email" className="text-foreground mb-1.5 block text-sm font-medium">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="tu@email.com"
                className="border-input bg-background text-foreground placeholder:text-muted-foreground focus:border-primary focus:ring-primary/20 w-full rounded-lg border px-4 py-2.5 focus:ring-2 focus:outline-none disabled:opacity-50"
                required
                autoFocus
                disabled={isLoading}
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="bg-primary text-primary-foreground hover:bg-primary/90 focus:ring-primary w-full rounded-lg px-4 py-2.5 font-medium transition-colors focus:ring-2 focus:ring-offset-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Enviando...
                </span>
              ) : (
                'Enviar enlace de recuperación'
              )}
            </button>
          </form>

          {/* Back to login */}
          <div className="mt-6 text-center">
            <Link
              href={`/login${email ? `?email=${encodeURIComponent(email)}` : ''}`}
              className={`text-muted-foreground hover:text-foreground inline-flex items-center gap-2 text-sm transition-colors ${isLoading ? 'pointer-events-none opacity-50' : ''}`}
            >
              <ArrowLeft className="h-4 w-4" />
              Volver al inicio de sesión
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
