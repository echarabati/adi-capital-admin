/**
 * Pago Dialog Component
 *
 * Dialog for registering payments to capital calls.
 *
 * @see INVE-006
 */

'use client';

import { useTransition, useState } from 'react';
import { toast } from 'sonner';
import { DollarSign } from 'lucide-react';

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

import { registrarPagoCapitalCall } from '@/lib/actions/calendario-pagos/calendario-pagos-mutations';
import type { CalendarioPagoListItem } from '@/lib/actions/calendario-pagos/calendario-pagos-queries';

interface PagoDialogProps {
  open: boolean;
  onClose: () => void;
  inversionId: string;
  inversionistaId: string;
  item: CalendarioPagoListItem | null;
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function PagoDialog({ open, onClose, inversionId, inversionistaId, item }: PagoDialogProps) {
  const [isPending, startTransition] = useTransition();

  // Calculate pending balance
  const montoEsperado = Number(item?.montoEsperado || 0);
  const montoPagado = Number(item?.montoPagado || 0);
  const saldoPendiente = Math.max(0, montoEsperado - montoPagado);

  // Form state
  const [monto, setMonto] = useState('');
  const [generarApo, setGenerarApo] = useState(false);

  // Reset when dialog opens
  if (open && item && monto === '' && saldoPendiente > 0) {
    setMonto(saldoPendiente.toString());
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!item) return;

    const montoNum = Number(monto) || 0;
    if (montoNum <= 0) {
      toast.error('El monto debe ser mayor a 0');
      return;
    }

    if (montoNum > saldoPendiente) {
      toast.error(`Monto excede saldo pendiente: ${formatCurrency(saldoPendiente)}`);
      return;
    }

    startTransition(async () => {
      try {
        const result = await registrarPagoCapitalCall(item.id, inversionId, inversionistaId, {
          monto,
          generarApo,
        });

        if ('error' in result && result.error) {
          toast.error(result.error);
          return;
        }

        toast.success('Pago registrado correctamente');
        setMonto('');
        setGenerarApo(false);
        onClose();
      } catch {
        toast.error('Algo salió mal. Intenta de nuevo.');
      }
    });
  };

  const handleClose = () => {
    setMonto('');
    setGenerarApo(false);
    onClose();
  };

  return (
    <Dialog open={open} onOpenChange={(isOpen) => !isOpen && handleClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <DollarSign className="h-5 w-5" />
            Registrar Pago
          </DialogTitle>
          <DialogDescription>
            Capital call #{item?.numero} — Saldo pendiente: {formatCurrency(saldoPendiente)}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Summary */}
          <div className="bg-secondary/50 rounded-lg p-3 text-sm">
            <div className="flex justify-between">
              <span className="text-muted-foreground">Monto esperado:</span>
              <span className="font-medium">{formatCurrency(montoEsperado)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Ya pagado:</span>
              <span className="font-medium">{formatCurrency(montoPagado)}</span>
            </div>
            <div className="mt-2 flex justify-between border-t pt-2 font-semibold">
              <span>Pendiente:</span>
              <span className="text-primary">{formatCurrency(saldoPendiente)}</span>
            </div>
          </div>

          {/* Monto */}
          <div className="space-y-2">
            <label htmlFor="monto" className="text-sm font-medium">
              Monto a pagar *
            </label>
            <Input
              id="monto"
              type="number"
              step="0.01"
              min="0"
              max={saldoPendiente}
              placeholder={saldoPendiente.toString()}
              value={monto}
              onChange={(e) => setMonto(e.target.value)}
              required
            />
            <p className="text-muted-foreground text-xs">
              Máximo: {formatCurrency(saldoPendiente)}
            </p>
          </div>

          {/* Generar APO checkbox */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="generarApo"
              checked={generarApo}
              onChange={(e) => setGenerarApo(e.target.checked)}
              className="h-4 w-4 rounded border-gray-300"
            />
            <label htmlFor="generarApo" className="text-sm">
              Generar movimiento APO (borrador)
            </label>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={handleClose} disabled={isPending}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isPending || saldoPendiente <= 0}>
              {isPending ? 'Registrando...' : 'Registrar Pago'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
