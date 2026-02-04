'use client';

/**
 * CuentaBancariaFormDialog Component
 *
 * Dialog for creating and editing bank accounts.
 * Uses react-hook-form with zod validation.
 *
 * @see FOND-004
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
import {
  createCuentaBancaria,
  updateCuentaBancaria,
} from '@/lib/actions/cuentas-bancarias/cuentas-bancarias-mutations';
import {
  createCuentaBancariaSchema,
  MONEDA_OPTIONS,
} from '@/lib/validations/cuentas-bancarias/cuenta-bancaria-validation';
import { toast } from 'sonner';
import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createCuentaBancariaSchema>;

interface CuentaBancariaFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondoId: string;
  cuenta?: {
    id: string;
    banco: string;
    numero: string;
    clabe: string | null;
    moneda: string;
  };
}

// Display labels for select options
const MONEDA_LABELS: Record<string, string> = {
  MXN: 'Peso Mexicano (MXN)',
  USD: 'Dólar (USD)',
  EUR: 'Euro (EUR)',
  ILS: 'Shekel (ILS)',
};

// =============================================================================
// Component
// =============================================================================

export function CuentaBancariaFormDialog({
  mode,
  open,
  onOpenChange,
  fondoId,
  cuenta,
}: CuentaBancariaFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createCuentaBancariaSchema),
    defaultValues: {
      banco: '',
      numero: '',
      clabe: '',
      moneda: 'MXN',
    },
  });

  // Reset form when dialog opens/closes or cuenta changes
  useEffect(() => {
    if (mode === 'edit' && cuenta && open) {
      reset({
        banco: cuenta.banco,
        numero: cuenta.numero,
        clabe: cuenta.clabe || '',
        moneda: cuenta.moneda as FormData['moneda'],
      });
    } else if (mode === 'create' && open) {
      reset({
        banco: '',
        numero: '',
        clabe: '',
        moneda: 'MXN',
      });
    }
  }, [mode, cuenta, open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createCuentaBancaria(fondoId, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Cuenta creada correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (cuenta) {
        const result = await updateCuentaBancaria(cuenta.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Cuenta actualizada correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar cuenta');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nueva Cuenta Bancaria' : 'Editar Cuenta'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos de la nueva cuenta bancaria.'
              : 'Modifica los datos de la cuenta.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Banco */}
          <div className="space-y-1.5">
            <label htmlFor="banco" className="text-sm font-medium">
              Banco
            </label>
            <Input
              id="banco"
              {...register('banco')}
              placeholder="Ej: BBVA, Santander"
              disabled={isSubmitting}
            />
            {errors.banco && <p className="text-destructive text-sm">{errors.banco.message}</p>}
          </div>

          {/* Número de Cuenta */}
          <div className="space-y-1.5">
            <label htmlFor="numero" className="text-sm font-medium">
              Número de Cuenta
            </label>
            <Input
              id="numero"
              {...register('numero')}
              placeholder="Ej: 0123456789"
              disabled={isSubmitting}
            />
            {errors.numero && <p className="text-destructive text-sm">{errors.numero.message}</p>}
          </div>

          {/* CLABE */}
          <div className="space-y-1.5">
            <label htmlFor="clabe" className="text-sm font-medium">
              CLABE <span className="text-muted-foreground">(opcional)</span>
            </label>
            <Input
              id="clabe"
              {...register('clabe')}
              placeholder="18 dígitos"
              maxLength={18}
              disabled={isSubmitting}
            />
            {errors.clabe && <p className="text-destructive text-sm">{errors.clabe.message}</p>}
          </div>

          {/* Moneda */}
          <div className="space-y-1.5">
            <label htmlFor="moneda" className="text-sm font-medium">
              Moneda
            </label>
            <select
              id="moneda"
              {...register('moneda')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              {MONEDA_OPTIONS.map((moneda) => (
                <option key={moneda} value={moneda}>
                  {MONEDA_LABELS[moneda]}
                </option>
              ))}
            </select>
            {errors.moneda && <p className="text-destructive text-sm">{errors.moneda.message}</p>}
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
