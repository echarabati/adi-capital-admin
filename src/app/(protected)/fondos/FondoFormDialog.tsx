'use client';

/**
 * FondoFormDialog Component
 *
 * Dialog for creating and editing fondos.
 * Uses react-hook-form with zod validation.
 *
 * @see FOND-002
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
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
import { createFondo, updateFondo } from '@/lib/actions/fondos/fondos-mutations';
import {
  createFondoSchema,
  MONEDA_OPTIONS,
  METODO_CASCADA_OPTIONS,
} from '@/lib/validations/fondos/fondo-validation';
import { toast } from 'sonner';
import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createFondoSchema>;

interface FondoFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondo?: {
    id: string;
    nombre: string;
    monedaBase: string;
    metodoCascada?: string;
  };
}

// Display labels for select options
const MONEDA_LABELS: Record<string, string> = {
  MXN: 'Peso Mexicano (MXN)',
  USD: 'Dólar (USD)',
  EUR: 'Euro (EUR)',
  ILS: 'Shekel (ILS)',
};

const CASCADA_LABELS: Record<string, string> = {
  pref_primero: 'Preferente Primero',
  capital_primero: 'Capital Primero',
};

// =============================================================================
// Component
// =============================================================================

export function FondoFormDialog({ mode, open, onOpenChange, fondo }: FondoFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createFondoSchema),
    defaultValues: {
      nombre: '',
      monedaBase: 'MXN',
      metodoCascada: 'pref_primero',
    },
  });

  // Reset form when dialog opens/closes or fondo changes
  useEffect(() => {
    if (mode === 'edit' && fondo && open) {
      reset({
        nombre: fondo.nombre,
        monedaBase: fondo.monedaBase as FormData['monedaBase'],
        metodoCascada: (fondo.metodoCascada || 'pref_primero') as FormData['metodoCascada'],
      });
    } else if (mode === 'create' && open) {
      reset({
        nombre: '',
        monedaBase: 'MXN',
        metodoCascada: 'pref_primero',
      });
    }
  }, [mode, fondo, open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createFondo(data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Fondo creado correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (fondo) {
        const result = await updateFondo(fondo.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Fondo actualizado correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar fondo');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Fondo' : 'Editar Fondo'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo fondo de inversión.'
              : 'Modifica los datos del fondo.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: ADI Capital"
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-destructive text-sm">{errors.nombre.message}</p>}
          </div>

          {/* Moneda Base */}
          <div className="space-y-1.5">
            <label htmlFor="monedaBase" className="text-sm font-medium">
              Moneda Base
            </label>
            <select
              id="monedaBase"
              {...register('monedaBase')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {MONEDA_OPTIONS.map((moneda) => (
                <option key={moneda} value={moneda}>
                  {MONEDA_LABELS[moneda]}
                </option>
              ))}
            </select>
            {errors.monedaBase && (
              <p className="text-destructive text-sm">{errors.monedaBase.message}</p>
            )}
          </div>

          {/* Método Cascada */}
          <div className="space-y-1.5">
            <label htmlFor="metodoCascada" className="text-sm font-medium">
              Método de Cascada
            </label>
            <select
              id="metodoCascada"
              {...register('metodoCascada')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {METODO_CASCADA_OPTIONS.map((metodo) => (
                <option key={metodo} value={metodo}>
                  {CASCADA_LABELS[metodo]}
                </option>
              ))}
            </select>
            {errors.metodoCascada && (
              <p className="text-destructive text-sm">{errors.metodoCascada.message}</p>
            )}
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
