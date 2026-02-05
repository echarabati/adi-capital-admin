/**
 * Calendario Form Dialog Component
 *
 * Simple dialog for creating/editing capital calls.
 *
 * @see INVE-005
 */

'use client';

import { useTransition, useState } from 'react';
import { toast } from 'sonner';

import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';

import type { CalendarioPagoFormInput } from '@/lib/validations/calendario-pagos/calendario-pagos-validation';
import {
  createCalendarioPago,
  updateCalendarioPago,
} from '@/lib/actions/calendario-pagos/calendario-pagos-mutations';
import type { CalendarioPagoListItem } from '@/lib/actions/calendario-pagos/calendario-pagos-queries';

interface CalendarioFormDialogProps {
  open: boolean;
  onClose: () => void;
  inversionId: string;
  editingItem: CalendarioPagoListItem | null;
}

function formatDateForInput(date: Date): string {
  return date.toISOString().split('T')[0];
}

export function CalendarioFormDialog({
  open,
  onClose,
  inversionId,
  editingItem,
}: CalendarioFormDialogProps) {
  const [isPending, startTransition] = useTransition();
  const isEditing = !!editingItem;

  // Initial values based on editing item
  const initialFecha = editingItem ? formatDateForInput(editingItem.fechaProgramada) : '';
  const initialMonto = editingItem?.montoEsperado ?? '';
  const initialNotas = editingItem?.notas ?? '';

  // Form state
  const [fechaProgramada, setFechaProgramada] = useState(initialFecha);
  const [montoEsperado, setMontoEsperado] = useState(initialMonto);
  const [notas, setNotas] = useState(initialNotas);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fechaProgramada || !montoEsperado) {
      toast.error('Por favor completa los campos requeridos');
      return;
    }

    const data: CalendarioPagoFormInput = {
      fechaProgramada,
      montoEsperado,
      notas: notas || null,
    };

    startTransition(async () => {
      try {
        const result = isEditing
          ? await updateCalendarioPago(editingItem.id, inversionId, data)
          : await createCalendarioPago(inversionId, data);

        if ('error' in result && result.error) {
          toast.error(result.error);
          return;
        }

        toast.success(isEditing ? 'Capital call actualizado' : 'Capital call creado');
        onClose();
      } catch {
        toast.error('Algo salió mal. Intenta de nuevo.');
      }
    });
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar' : 'Nuevo'} Capital Call</DialogTitle>
          <DialogDescription>
            {isEditing
              ? 'Modifica los datos del capital call.'
              : 'Programa un nuevo capital call para esta inversión.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Fecha Programada */}
          <div className="space-y-2">
            <label htmlFor="fechaProgramada" className="text-sm font-medium">
              Fecha Programada *
            </label>
            <Input
              id="fechaProgramada"
              type="date"
              value={fechaProgramada}
              onChange={(e) => setFechaProgramada(e.target.value)}
              required
            />
          </div>

          {/* Monto Esperado */}
          <div className="space-y-2">
            <label htmlFor="montoEsperado" className="text-sm font-medium">
              Monto Esperado *
            </label>
            <Input
              id="montoEsperado"
              type="number"
              step="0.01"
              min="0"
              placeholder="100000"
              value={montoEsperado}
              onChange={(e) => setMontoEsperado(e.target.value)}
              required
            />
          </div>

          {/* Notas */}
          <div className="space-y-2">
            <label htmlFor="notas" className="text-sm font-medium">
              Notas (opcional)
            </label>
            <Input
              id="notas"
              placeholder="Notas sobre este capital call..."
              value={notas}
              onChange={(e) => setNotas(e.target.value)}
            />
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Guardando...' : isEditing ? 'Guardar' : 'Crear'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
