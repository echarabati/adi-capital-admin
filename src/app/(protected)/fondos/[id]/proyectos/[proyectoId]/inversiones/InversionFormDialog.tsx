'use client';

/**
 * InversionFormDialog Component
 *
 * Dialog for creating inversiones with Admin Fee configuration.
 *
 * @see INVE-002
 */

import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { ChevronDown, ChevronUp } from 'lucide-react';
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
import { createInversion } from '@/lib/actions/inversiones/inversiones-mutations';
import {
  createInversionSchema,
  TIPO_ADMIN_FEE_OPTIONS,
  BASE_ADMIN_FEE_OPTIONS,
  METODO_ADMIN_FEE_OPTIONS,
} from '@/lib/validations/inversiones/inversion-validation';
import { InversionistaDropdownItem } from '@/lib/actions/inversiones/inversiones-queries';
import { toast } from 'sonner';
import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createInversionSchema>;

interface InversionFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  proyectoId: string;
  inversionistas: InversionistaDropdownItem[];
}

// Display labels
const TIPO_LABELS: Record<string, string> = {
  one_time: 'One-time (único)',
  anual: 'Anual',
};

const BASE_LABELS: Record<string, string> = {
  compromiso: 'Compromiso',
  aportado: 'Aportado',
};

const METODO_LABELS: Record<string, string> = {
  capital_call_independiente: 'Capital Call Independiente',
  incluido_en_capital_call: 'Incluido en Capital Call',
};

// =============================================================================
// Component
// =============================================================================

export function InversionFormDialog({
  open,
  onOpenChange,
  proyectoId,
  inversionistas,
}: InversionFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showAdminFee, setShowAdminFee] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createInversionSchema),
    defaultValues: {
      inversionistaId: '',
      compromiso: '',
      prefRate: '',
      successFeePct: '',
      adminFeeTipo: null,
      adminFeePct: '',
      adminFeeBase: null,
      adminFeeMetodo: null,
      notas: '',
    },
  });

  // Reset form when dialog opens
  useEffect(() => {
    if (open) {
      reset();
      setShowAdminFee(false);
    }
  }, [open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      const result = await createInversion(proyectoId, data);
      if (result.error) {
        toast.error(result.error);
      } else {
        toast.success('Inversión creada correctamente');
        onOpenChange(false);
        reset();
      }
    } catch {
      toast.error('Error al crear inversión');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Nueva Inversión</DialogTitle>
          <DialogDescription>Vincula un inversionista con este proyecto.</DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Inversionista Selector */}
          <div className="space-y-1.5">
            <label htmlFor="inversionistaId" className="text-sm font-medium">
              Inversionista <span className="text-destructive">*</span>
            </label>
            <select
              id="inversionistaId"
              {...register('inversionistaId')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Selecciona un inversionista</option>
              {inversionistas.map((inv) => (
                <option key={inv.id} value={inv.id}>
                  {inv.nombre}
                </option>
              ))}
            </select>
            {errors.inversionistaId && (
              <p className="text-destructive text-sm">{errors.inversionistaId.message}</p>
            )}
          </div>

          {/* Compromiso */}
          <div className="space-y-1.5">
            <label htmlFor="compromiso" className="text-sm font-medium">
              Compromiso (MXN) <span className="text-destructive">*</span>
            </label>
            <Input
              id="compromiso"
              {...register('compromiso')}
              placeholder="Ej: 1000000"
              disabled={isSubmitting}
              type="text"
              inputMode="decimal"
            />
            {errors.compromiso && (
              <p className="text-destructive text-sm">{errors.compromiso.message}</p>
            )}
          </div>

          {/* Optional Overrides */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <label htmlFor="prefRate" className="text-sm font-medium">
                Tasa Pref % <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                id="prefRate"
                {...register('prefRate')}
                placeholder="Hereda del proyecto"
                disabled={isSubmitting}
                type="text"
                inputMode="decimal"
              />
            </div>
            <div className="space-y-1.5">
              <label htmlFor="successFeePct" className="text-sm font-medium">
                Success Fee % <span className="text-muted-foreground">(opcional)</span>
              </label>
              <Input
                id="successFeePct"
                {...register('successFeePct')}
                placeholder="Hereda del proyecto"
                disabled={isSubmitting}
                type="text"
                inputMode="decimal"
              />
            </div>
          </div>

          {/* Admin Fee Section (Collapsible) */}
          <div className="rounded-lg border p-3">
            <button
              type="button"
              onClick={() => setShowAdminFee(!showAdminFee)}
              className="flex w-full items-center justify-between text-sm font-medium"
            >
              <span>Configuración Admin Fee</span>
              {showAdminFee ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </button>

            {showAdminFee && (
              <div className="mt-4 space-y-4">
                {/* Tipo */}
                <div className="space-y-1.5">
                  <label htmlFor="adminFeeTipo" className="text-sm font-medium">
                    Tipo
                  </label>
                  <select
                    id="adminFeeTipo"
                    {...register('adminFeeTipo')}
                    disabled={isSubmitting}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Sin Admin Fee</option>
                    {TIPO_ADMIN_FEE_OPTIONS.map((tipo) => (
                      <option key={tipo} value={tipo}>
                        {TIPO_LABELS[tipo]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Porcentaje */}
                <div className="space-y-1.5">
                  <label htmlFor="adminFeePct" className="text-sm font-medium">
                    Porcentaje %
                  </label>
                  <Input
                    id="adminFeePct"
                    {...register('adminFeePct')}
                    placeholder="Ej: 2"
                    disabled={isSubmitting}
                    type="text"
                    inputMode="decimal"
                  />
                </div>

                {/* Base */}
                <div className="space-y-1.5">
                  <label htmlFor="adminFeeBase" className="text-sm font-medium">
                    Base de cálculo
                  </label>
                  <select
                    id="adminFeeBase"
                    {...register('adminFeeBase')}
                    disabled={isSubmitting}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar</option>
                    {BASE_ADMIN_FEE_OPTIONS.map((base) => (
                      <option key={base} value={base}>
                        {BASE_LABELS[base]}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Método */}
                <div className="space-y-1.5">
                  <label htmlFor="adminFeeMetodo" className="text-sm font-medium">
                    Método de cobro
                  </label>
                  <select
                    id="adminFeeMetodo"
                    {...register('adminFeeMetodo')}
                    disabled={isSubmitting}
                    className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">Seleccionar</option>
                    {METODO_ADMIN_FEE_OPTIONS.map((metodo) => (
                      <option key={metodo} value={metodo}>
                        {METODO_LABELS[metodo]}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}
          </div>

          {/* Notas */}
          <div className="space-y-1.5">
            <label htmlFor="notas" className="text-sm font-medium">
              Notas <span className="text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id="notas"
              {...register('notas')}
              placeholder="Notas adicionales..."
              disabled={isSubmitting}
              rows={2}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
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
              {isSubmitting ? 'Creando...' : 'Crear Inversión'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
