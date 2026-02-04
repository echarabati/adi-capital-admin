'use client';

/**
 * UserFormDialog Component
 *
 * Dialog for creating or editing users.
 * Handles form validation and server action submission.
 *
 * @see CRUD-002
 */

import { useEffect, useState } from 'react';
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
import { createUser, updateUser } from '@/lib/actions/admin/user-admin';
import { getAssignableRoles, getRoleDisplayName, ROLES, Role } from '@/src/config/roles';
import { toast } from 'sonner';

// =============================================================================
// Types
// =============================================================================

interface UserFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentUserRole: string;
  user?: {
    id: string;
    name: string | null;
    email: string;
    role: string;
  };
}

// =============================================================================
// Form Schema
// =============================================================================

const baseSchema = {
  name: z
    .string()
    .min(2, 'El nombre debe tener al menos 2 caracteres')
    .max(100, 'El nombre no puede exceder 100 caracteres'),
  email: z.string().email('Email inválido'),
  role: z.enum([ROLES.AGENTE, ROLES.ADMIN_FONDO, ROLES.SUPER_ADMIN], {
    message: 'Rol inválido',
  }),
};

const createSchema = z.object({
  ...baseSchema,
  password: z.string().min(8, 'La contraseña debe tener al menos 8 caracteres').optional(),
});

const editSchema = z.object(baseSchema);

type CreateFormData = z.infer<typeof createSchema>;
type EditFormData = z.infer<typeof editSchema>;
type FormData = CreateFormData | EditFormData;

// =============================================================================
// Component
// =============================================================================

export function UserFormDialog({
  mode,
  open,
  onOpenChange,
  currentUserRole,
  user,
}: UserFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Get assignable roles for current user
  const assignableRoles = getAssignableRoles(currentUserRole);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(mode === 'create' ? createSchema : editSchema),
    defaultValues:
      mode === 'edit' && user
        ? {
            name: user.name || '',
            email: user.email,
            role: user.role as Role,
          }
        : {
            name: '',
            email: '',
            role: ROLES.ADMIN_FONDO,
            password: '',
          },
  });

  // Reset form when user changes (for edit mode)
  useEffect(() => {
    if (mode === 'edit' && user && open) {
      reset({
        name: user.name || '',
        email: user.email,
        role: user.role as Role,
      });
    } else if (mode === 'create' && open) {
      reset({
        name: '',
        email: '',
        role: ROLES.ADMIN_FONDO,
        password: '',
      });
    }
  }, [mode, user, open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createUser(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Usuario creado correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (user) {
        const result = await updateUser(user.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Usuario actualizado correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar usuario');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Crear usuario' : 'Editar usuario'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo usuario.'
              : 'Modifica los datos del usuario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Name */}
          <div className="space-y-1.5">
            <label htmlFor="name" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="name"
              {...register('name')}
              placeholder="Juan Pérez"
              disabled={isSubmitting}
            />
            {errors.name && <p className="text-destructive text-sm">{errors.name.message}</p>}
          </div>

          {/* Email */}
          <div className="space-y-1.5">
            <label htmlFor="email" className="text-sm font-medium">
              Email
            </label>
            <Input
              id="email"
              type="email"
              {...register('email')}
              placeholder="juan@example.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          {/* Role */}
          <div className="space-y-1.5">
            <label htmlFor="role" className="text-sm font-medium">
              Rol
            </label>
            <select
              id="role"
              {...register('role')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {assignableRoles.map((role) => (
                <option key={role} value={role}>
                  {getRoleDisplayName(role)}
                </option>
              ))}
            </select>
            {errors.role && <p className="text-destructive text-sm">{errors.role.message}</p>}
          </div>

          {/* Password (create only) */}
          {mode === 'create' && (
            <div className="space-y-1.5">
              <label htmlFor="password" className="text-sm font-medium">
                Contraseña
              </label>
              <Input
                id="password"
                type="password"
                {...register('password' as keyof FormData)}
                placeholder="••••••••"
                disabled={isSubmitting}
              />
              {(errors as { password?: { message?: string } }).password && (
                <p className="text-destructive text-sm">
                  {(errors as { password?: { message?: string } }).password?.message}
                </p>
              )}
            </div>
          )}

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
              {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
