'use client';

/**
 * BeneficiarioFormDialog Component
 *
 * Dialog for creating and editing beneficiaries.
 *
 * @see FOND-005
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
  createBeneficiario,
  updateBeneficiario,
} from '@/lib/actions/beneficiarios/beneficiarios-mutations';
import { createBeneficiarioSchema } from '@/lib/validations/beneficiarios/beneficiario-validation';
import { toast } from 'sonner';
import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createBeneficiarioSchema>;

interface BeneficiarioFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondoId: string;
  beneficiario?: {
    id: string;
    nombre: string;
    banco: string | null;
    numeroCuenta: string | null;
    clabe: string | null;
    notas: string | null;
  };
}

// =============================================================================
// Component
// =============================================================================

export function BeneficiarioFormDialog({
  mode,
  open,
  onOpenChange,
  fondoId,
  beneficiario,
}: BeneficiarioFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createBeneficiarioSchema),
    defaultValues: {
      nombre: '',
      banco: '',
      numeroCuenta: '',
      clabe: '',
      notas: '',
    },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (mode === 'edit' && beneficiario && open) {
      reset({
        nombre: beneficiario.nombre,
        banco: beneficiario.banco || '',
        numeroCuenta: beneficiario.numeroCuenta || '',
        clabe: beneficiario.clabe || '',
        notas: beneficiario.notas || '',
      });
    } else if (mode === 'create' && open) {
      reset({
        nombre: '',
        banco: '',
        numeroCuenta: '',
        clabe: '',
        notas: '',
      });
    }
  }, [mode, beneficiario, open, reset]);

  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createBeneficiario(fondoId, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Beneficiario creado correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (beneficiario) {
        const result = await updateBeneficiario(beneficiario.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Beneficiario actualizado correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar beneficiario');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {mode === 'create' ? 'Nuevo Beneficiario' : 'Editar Beneficiario'}
          </DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo beneficiario.'
              : 'Modifica los datos del beneficiario.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre <span className="text-destructive">*</span>
            </label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Nombre del beneficiario"
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-destructive text-sm">{errors.nombre.message}</p>}
          </div>

          {/* Banco */}
          <div className="space-y-1.5">
            <label htmlFor="banco" className="text-sm font-medium">
              Banco <span className="text-muted-foreground">(opcional)</span>
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
            <label htmlFor="numeroCuenta" className="text-sm font-medium">
              Número de Cuenta <span className="text-muted-foreground">(opcional)</span>
            </label>
            <Input
              id="numeroCuenta"
              {...register('numeroCuenta')}
              placeholder="Ej: 0123456789"
              disabled={isSubmitting}
            />
            {errors.numeroCuenta && (
              <p className="text-destructive text-sm">{errors.numeroCuenta.message}</p>
            )}
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

          {/* Notas */}
          <div className="space-y-1.5">
            <label htmlFor="notas" className="text-sm font-medium">
              Notas <span className="text-muted-foreground">(opcional)</span>
            </label>
            <Input
              id="notas"
              {...register('notas')}
              placeholder="Notas adicionales"
              disabled={isSubmitting}
            />
            {errors.notas && <p className="text-destructive text-sm">{errors.notas.message}</p>}
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
