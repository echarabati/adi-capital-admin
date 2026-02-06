'use client';

/**
 * Step 3: Preview
 *
 * Shows calculation preview with CascadaPreview component.
 *
 * @see WIZ-001 AC: Step 3: Preview cálculo
 * @see WIZ-004: CMP-004 CascadaPreview
 */

import { useMemo } from 'react';
import { CascadaPreview } from '@/components/wizard/CascadaPreview';
import { calcularCascadaPrefPrimero } from '@/lib/calculations/cascada-pref-primero';
import { calcularCascadaCapitalPrimero } from '@/lib/calculations/cascada-capital-primero';
import type { InversionCascadaInput } from '@/lib/calculations/cascada-pref-primero';

// =============================================================================
// Types
// =============================================================================

interface Step3PreviewProps {
  proyectoNombre: string | null;
  monto: number;
  metodoCascada: string | null;
  inversiones: InversionCascadaInput[];
  isLoading?: boolean;
}

// =============================================================================
// Currency Formatter
// =============================================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(value);

// =============================================================================
// Step3Preview
// =============================================================================

export function Step3Preview({
  proyectoNombre,
  monto,
  metodoCascada,
  inversiones,
  isLoading = false,
}: Step3PreviewProps) {
  // Calculate cascada
  const cascadaResult = useMemo(() => {
    if (monto <= 0 || inversiones.length === 0) return null;

    // Choose calculation method based on proyecto setting
    if (metodoCascada === 'capital_primero') {
      return calcularCascadaCapitalPrimero(monto, inversiones);
    }
    // Default to pref_primero
    return calcularCascadaPrefPrimero(monto, inversiones);
  }, [monto, inversiones, metodoCascada]);

  const cascadaLabel =
    metodoCascada === 'pref_primero'
      ? 'Pref Primero'
      : metodoCascada === 'capital_primero'
        ? 'Capital Primero'
        : 'Heredar de fondo';

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Preview de Distribución</h2>
        <p className="text-muted-foreground text-sm">
          Revisa el cálculo de distribución antes de confirmar.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 space-y-2 rounded-lg p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Proyecto:</span>
          <span className="text-foreground font-medium">{proyectoNombre}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Monto total:</span>
          <span className="text-foreground font-medium">{formatCurrency(monto)}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Método cascada:</span>
          <span className="text-foreground font-medium">{cascadaLabel}</span>
        </div>
      </div>

      {/* CascadaPreview Component */}
      <CascadaPreview result={cascadaResult} isLoading={isLoading} />
    </div>
  );
}
