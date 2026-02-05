'use client';

/**
 * InversionistaFormDialog Component
 *
 * Dialog for creating and editing inversionistas.
 * Includes multi-select for fondo assignments.
 *
 * @see INV-002
 */

import { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import {
  createInversionista,
  updateInversionista,
} from '@/lib/actions/inversionistas/inversionistas-mutations';
import { createInversionistaSchema } from '@/lib/validations/inversionistas/inversionista-validation';
import { toast } from 'sonner';
import { z } from 'zod';
import { Check } from 'lucide-react';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createInversionistaSchema>;

interface InversionistaFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondos: { id: string; nombre: string }[];
  inversionista?: {
    id: string;
    nombre: string;
    email: string | null;
    telefono: string | null;
    esFundador: boolean;
    fondos: { id: string; nombre: string }[];
  };
}

// =============================================================================
// Component
// =============================================================================

export function InversionistaFormDialog({
  mode,
  open,
  onOpenChange,
  fondos,
  inversionista,
}: InversionistaFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    control,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createInversionistaSchema),
    defaultValues: {
      nombre: '',
      email: '',
      telefono: '',
      esFundador: false,
      fondoIds: [],
    },
  });

  // Reset form when dialog opens/closes or inversionista changes
  useEffect(() => {
    if (mode === 'edit' && inversionista && open) {
      reset({
        nombre: inversionista.nombre,
        email: inversionista.email || '',
        telefono: inversionista.telefono || '',
        esFundador: inversionista.esFundador,
        fondoIds: inversionista.fondos.map((f) => f.id),
      });
    } else if (mode === 'create' && open) {
      reset({
        nombre: '',
        email: '',
        telefono: '',
        esFundador: false,
        fondoIds: [],
      });
    }
  }, [mode, inversionista, open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createInversionista(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Inversionista creado correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (inversionista) {
        const result = await updateInversionista(inversionista.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Inversionista actualizado correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar inversionista');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Inversionista' : 'Editar Inversionista'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo inversionista.'
              : 'Modifica los datos del inversionista.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre *
            </label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Nombre completo"
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-destructive text-sm">{errors.nombre.message}</p>}
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
              placeholder="correo@ejemplo.com"
              disabled={isSubmitting}
            />
            {errors.email && <p className="text-destructive text-sm">{errors.email.message}</p>}
          </div>

          {/* Teléfono */}
          <div className="space-y-1.5">
            <label htmlFor="telefono" className="text-sm font-medium">
              Teléfono
            </label>
            <Input
              id="telefono"
              {...register('telefono')}
              placeholder="+52 55 1234 5678"
              disabled={isSubmitting}
            />
          </div>

          {/* Fondos Multi-select */}
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Fondos *</label>
            <Controller
              name="fondoIds"
              control={control}
              render={({ field }) => (
                <div className="border-input max-h-40 overflow-y-auto rounded-md border p-2">
                  {fondos.length === 0 ? (
                    <p className="text-muted-foreground text-sm">No hay fondos disponibles</p>
                  ) : (
                    fondos.map((fondo) => {
                      const isSelected = field.value.includes(fondo.id);
                      return (
                        <button
                          key={fondo.id}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              field.onChange(field.value.filter((id) => id !== fondo.id));
                            } else {
                              field.onChange([...field.value, fondo.id]);
                            }
                          }}
                          className={`flex w-full items-center gap-2 rounded px-2 py-1.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-primary/10 text-primary'
                              : 'hover:bg-secondary text-foreground'
                          }`}
                          disabled={isSubmitting}
                        >
                          <div
                            className={`flex h-4 w-4 items-center justify-center rounded border ${
                              isSelected ? 'border-primary bg-primary' : 'border-input'
                            }`}
                          >
                            {isSelected && <Check className="h-3 w-3 text-white" />}
                          </div>
                          {fondo.nombre}
                        </button>
                      );
                    })
                  )}
                </div>
              )}
            />
            {errors.fondoIds && (
              <p className="text-destructive text-sm">{errors.fondoIds.message}</p>
            )}
          </div>

          {/* Es Fundador */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="esFundador"
              {...register('esFundador')}
              disabled={isSubmitting}
              className="border-input h-4 w-4 rounded"
            />
            <label htmlFor="esFundador" className="text-sm">
              Marcar como Fundador
            </label>
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
              {isSubmitting ? 'Guardando...' : mode === 'create' ? 'Crear' : 'Guardar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
