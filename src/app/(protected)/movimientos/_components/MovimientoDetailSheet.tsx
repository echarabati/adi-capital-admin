'use client';

/**
 * MovimientoDetailSheet Component
 *
 * Shows detailed information for a movimiento in a slide-out sheet.
 * Sections: General, Referencias
 *
 * @see MOV-008
 */

import { X } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle } from '@/components/ui/sheet';
import { MovimientoListItem } from '@/lib/actions/movimientos/movimientos-queries';
import {
  CONCEPTO_LABELS,
  ESTADO_LABELS,
} from '@/lib/validations/movimientos/movimientos-validation';

// =============================================================================
// Types
// =============================================================================

interface MovimientoDetailSheetProps {
  movimiento: MovimientoListItem | null;
  isOpen: boolean;
  onClose: () => void;
}

// =============================================================================
// Helpers
// =============================================================================

function formatDate(date: Date | string | null): string {
  if (!date) return '—';
  const d = typeof date === 'string' ? new Date(date) : date;
  return d.toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatMonto(monto: string | null, moneda: string): string {
  if (!monto) return '—';
  const num = parseFloat(monto);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: moneda || 'MXN',
  }).format(num);
}

function getEstadoBadge(estado: string): { color: string; label: string } {
  const label = ESTADO_LABELS[estado as keyof typeof ESTADO_LABELS] || estado;
  switch (estado) {
    case 'confirmado':
      return { color: 'bg-emerald-500/10 text-emerald-600', label };
    case 'cancelado':
      return { color: 'bg-rose-500/10 text-rose-600', label };
    default:
      return { color: 'bg-amber-500/10 text-amber-600', label };
  }
}

// =============================================================================
// Component
// =============================================================================

export function MovimientoDetailSheet({ movimiento, isOpen, onClose }: MovimientoDetailSheetProps) {
  if (!movimiento) return null;

  const conceptoLabel =
    CONCEPTO_LABELS[movimiento.concepto as keyof typeof CONCEPTO_LABELS] || movimiento.concepto;
  const estadoBadge = getEstadoBadge(movimiento.estado);

  return (
    <Sheet open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <SheetContent className="w-full overflow-y-auto sm:max-w-lg">
        <SheetHeader className="border-border border-b pb-4">
          <div className="flex items-center justify-between">
            <SheetTitle className="text-lg font-semibold">Detalle de Movimiento</SheetTitle>
            <button
              onClick={onClose}
              className="text-muted-foreground hover:text-foreground transition-colors"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </SheetHeader>

        <div className="space-y-6 py-6">
          {/* General Section */}
          <section>
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">Información General</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Concepto</span>
                <span className="font-medium">{conceptoLabel}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Monto</span>
                <span className="text-lg font-semibold">
                  {formatMonto(movimiento.monto, movimiento.moneda)}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Fecha</span>
                <span>{formatDate(movimiento.fechaMovimiento)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Estado</span>
                <span className={`rounded px-2 py-0.5 text-xs font-medium ${estadoBadge.color}`}>
                  {estadoBadge.label}
                </span>
              </div>
              {movimiento.descripcion && (
                <div className="pt-2">
                  <span className="text-muted-foreground mb-1 block text-sm">Descripción</span>
                  <p className="bg-muted/50 rounded p-2 text-sm">{movimiento.descripcion}</p>
                </div>
              )}
            </div>
          </section>

          {/* Referencias Section */}
          <section className="border-border border-t pt-6">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">Referencias</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground text-sm">Fondo</span>
                <span>{movimiento.fondo?.nombre || '—'}</span>
              </div>
              {movimiento.inversionista && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Inversionista</span>
                  <span>{movimiento.inversionista.nombre}</span>
                </div>
              )}
              {movimiento.proyecto && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Proyecto</span>
                  <span>{movimiento.proyecto.nombre}</span>
                </div>
              )}
              {movimiento.inversion && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground text-sm">Inversión</span>
                  <span>{movimiento.inversion.id.slice(0, 8)}...</span>
                </div>
              )}
            </div>
          </section>

          {/* Metadata Section */}
          <section className="border-border border-t pt-6">
            <h3 className="text-muted-foreground mb-3 text-sm font-medium">Metadata</h3>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-muted-foreground">ID</span>
                <span className="font-mono text-xs">{movimiento.id}</span>
              </div>
            </div>
          </section>
        </div>
      </SheetContent>
    </Sheet>
  );
}
