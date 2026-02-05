'use client';

/**
 * ProyectoFormDialog Component
 *
 * Dialog for creating and editing projects.
 * Uses react-hook-form with zod validation.
 *
 * @see PROJ-002
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
import { createProyecto, updateProyecto } from '@/lib/actions/proyectos/proyectos-mutations';
import {
  createProyectoSchema,
  METODO_CASCADA_OPTIONS,
} from '@/lib/validations/proyectos/proyecto-validation';
import { toast } from 'sonner';
import { z } from 'zod';

// =============================================================================
// Types
// =============================================================================

type FormData = z.input<typeof createProyectoSchema>;

interface ProyectoFormDialogProps {
  mode: 'create' | 'edit';
  open: boolean;
  onOpenChange: (open: boolean) => void;
  fondoId: string;
  proyecto?: {
    id: string;
    codigo: string;
    nombre: string;
    descripcion: string | null;
    tasaPref: string | null;
    successFeePct: string | null;
    metodoCascada: string | null;
  };
}

// Display labels for select options
const CASCADA_LABELS: Record<string, string> = {
  pref_primero: 'Pref Primero (Adi Capital)',
  capital_primero: 'Capital Primero (Kentucky)',
};

// =============================================================================
// Component
// =============================================================================

export function ProyectoFormDialog({
  mode,
  open,
  onOpenChange,
  fondoId,
  proyecto,
}: ProyectoFormDialogProps) {
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Form setup
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormData>({
    resolver: zodResolver(createProyectoSchema),
    defaultValues: {
      codigo: '',
      nombre: '',
      descripcion: '',
      tasaPref: '12.00',
      successFeePct: '20',
      metodoCascada: null,
    },
  });

  // Reset form when dialog opens/closes or proyecto changes
  useEffect(() => {
    if (mode === 'edit' && proyecto && open) {
      reset({
        codigo: proyecto.codigo,
        nombre: proyecto.nombre,
        descripcion: proyecto.descripcion || '',
        tasaPref: proyecto.tasaPref || '12.00',
        successFeePct: proyecto.successFeePct || '',
        metodoCascada: proyecto.metodoCascada as FormData['metodoCascada'],
      });
    } else if (mode === 'create' && open) {
      reset({
        codigo: '',
        nombre: '',
        descripcion: '',
        tasaPref: '12.00',
        successFeePct: '20',
        metodoCascada: null,
      });
    }
  }, [mode, proyecto, open, reset]);

  // Handle form submit
  async function onSubmit(data: FormData) {
    setIsSubmitting(true);

    try {
      if (mode === 'create') {
        const result = await createProyecto(fondoId, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Proyecto creado correctamente');
          onOpenChange(false);
          reset();
        }
      } else if (proyecto) {
        const result = await updateProyecto(proyecto.id, data);
        if (result.error) {
          toast.error(result.error);
        } else {
          toast.success('Proyecto actualizado correctamente');
          onOpenChange(false);
        }
      }
    } catch {
      toast.error('Error al guardar proyecto');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{mode === 'create' ? 'Nuevo Proyecto' : 'Editar Proyecto'}</DialogTitle>
          <DialogDescription>
            {mode === 'create'
              ? 'Ingresa los datos del nuevo proyecto de inversión.'
              : 'Modifica los datos del proyecto.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          {/* Código */}
          <div className="space-y-1.5">
            <label htmlFor="codigo" className="text-sm font-medium">
              Código
            </label>
            <Input
              id="codigo"
              {...register('codigo')}
              placeholder="Ej: PRJ-001"
              disabled={isSubmitting}
            />
            {errors.codigo && <p className="text-destructive text-sm">{errors.codigo.message}</p>}
          </div>

          {/* Nombre */}
          <div className="space-y-1.5">
            <label htmlFor="nombre" className="text-sm font-medium">
              Nombre
            </label>
            <Input
              id="nombre"
              {...register('nombre')}
              placeholder="Ej: Torre Polanco"
              disabled={isSubmitting}
            />
            {errors.nombre && <p className="text-destructive text-sm">{errors.nombre.message}</p>}
          </div>

          {/* Descripción */}
          <div className="space-y-1.5">
            <label htmlFor="descripcion" className="text-sm font-medium">
              Descripción <span className="text-muted-foreground">(opcional)</span>
            </label>
            <textarea
              id="descripcion"
              {...register('descripcion')}
              placeholder="Breve descripción del proyecto..."
              disabled={isSubmitting}
              rows={3}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            />
            {errors.descripcion && (
              <p className="text-destructive text-sm">{errors.descripcion.message}</p>
            )}
          </div>

          {/* Tasa Pref % */}
          <div className="space-y-1.5">
            <label htmlFor="tasaPref" className="text-sm font-medium">
              Tasa Pref % <span className="text-muted-foreground">(default: 12%)</span>
            </label>
            <Input
              id="tasaPref"
              {...register('tasaPref')}
              placeholder="12.00"
              disabled={isSubmitting}
              type="text"
              inputMode="decimal"
            />
            {errors.tasaPref && (
              <p className="text-destructive text-sm">{errors.tasaPref.message}</p>
            )}
          </div>

          {/* Success Fee % */}
          <div className="space-y-1.5">
            <label htmlFor="successFeePct" className="text-sm font-medium">
              Success Fee % <span className="text-muted-foreground">(default: 20%)</span>
            </label>
            <Input
              id="successFeePct"
              {...register('successFeePct')}
              placeholder="20"
              disabled={isSubmitting}
              type="text"
              inputMode="decimal"
            />
            {errors.successFeePct && (
              <p className="text-destructive text-sm">{errors.successFeePct.message}</p>
            )}
          </div>

          {/* Método Cascada */}
          <div className="space-y-1.5">
            <label htmlFor="metodoCascada" className="text-sm font-medium">
              Método de Cascada{' '}
              <span className="text-muted-foreground">(hereda del fondo si vacío)</span>
            </label>
            <select
              id="metodoCascada"
              {...register('metodoCascada')}
              disabled={isSubmitting}
              className="border-input bg-background ring-offset-background focus-visible:ring-ring flex h-9 w-full rounded-md border px-3 py-1 text-sm shadow-sm transition-colors focus-visible:ring-1 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50"
            >
              <option value="">Heredar del fondo</option>
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
