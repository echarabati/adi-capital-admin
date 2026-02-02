'use client';

/**
 * InviteUserDialog Component
 *
 * Dialog for inviting users via email.
 * Uses the existing /api/invites/send endpoint.
 *
 * @see CRUD-002
 */

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

// =============================================================================
// Types
// =============================================================================

interface InviteUserDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// =============================================================================
// Form Schema
// =============================================================================

const inviteSchema = z.object({
  email: z.string().email('Email inválido'),
});

type InviteFormData = z.infer<typeof inviteSchema>;

// =============================================================================
// Component
// =============================================================================

export function InviteUserDialog({ open, onOpenChange }: InviteUserDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<InviteFormData>({
    resolver: zodResolver(inviteSchema),
    defaultValues: {
      email: '',
    },
  });

  async function onSubmit(data: InviteFormData) {
    setIsSubmitting(true);

    try {
      const response = await fetch('/api/invites/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: data.email }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        toast.error(result.message || 'Error al enviar invitación');
        return;
      }

      toast.success(`Invitación enviada a ${data.email}`);
      onOpenChange(false);
      reset();
    } catch {
      toast.error('Error al enviar invitación');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Invitar usuario</DialogTitle>
          <DialogDescription>
            Envía una invitación por email. El usuario podrá registrarse con su propia contraseña.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="invite-email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="invite-email"
              type="email"
              {...register('email')}
              placeholder="usuario@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Enviando...' : 'Enviar invitación'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
