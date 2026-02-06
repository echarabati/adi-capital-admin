'use client';

/**
 * CascadaPreview
 *
 * Displays cascada calculation results in a table format.
 * Shows distribution breakdown per investor with totals.
 *
 * @see WIZ-004: CMP-004 CascadaPreview
 */

import { useMemo } from 'react';
import { Badge } from '@/components/ui/Badge';
import { Skeleton } from '@/components/ui/Skeleton';
import { cn } from '@/lib/utils/cn';
import type { CascadaResult } from '@/lib/calculations/cascada-pref-primero';

// =============================================================================
// Types
// =============================================================================

interface CascadaPreviewProps {
  result: CascadaResult | null;
  isLoading?: boolean;
}

// =============================================================================
// Currency Formatter
// =============================================================================

const formatCurrency = (value: number) =>
  new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    minimumFractionDigits: 2,
  }).format(value);

// =============================================================================
// CascadaPreview Component
// =============================================================================

export function CascadaPreview({ result, isLoading = false }: CascadaPreviewProps) {
  // Method badge config
  const methodLabel = useMemo(() => {
    if (!result) return null;
    return result.meta.metodoCascada === 'pref_primero' ? 'Pref Primero' : 'Capital Primero';
  }, [result]);

  // Loading state
  if (isLoading) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="h-6 w-24" />
        </div>
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  // Empty state
  if (!result || result.distribuciones.length === 0) {
    return (
      <div className="bg-muted/50 rounded-lg p-8 text-center">
        <p className="text-muted-foreground">No hay distribuciones para mostrar</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Header with method badge */}
      <div className="flex items-center justify-between">
        <h3 className="text-foreground font-medium">
          Desglose por Inversionista ({result.meta.inversionesCount})
        </h3>
        {methodLabel && <Badge>{methodLabel}</Badge>}
      </div>

      {/* Distribution table */}
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full">
          <thead>
            <tr className="bg-muted/50 border-b">
              <th className="px-4 py-3 text-left text-xs font-semibold tracking-wider uppercase">
                Inversionista
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                A Pref
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                A Capital
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                A Utilidad
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                Fee
              </th>
              <th className="px-4 py-3 text-right text-xs font-semibold tracking-wider uppercase">
                Neto
              </th>
            </tr>
          </thead>
          <tbody>
            {result.distribuciones.map((dist, index) => (
              <tr
                key={dist.inversionId}
                className={cn(index < result.distribuciones.length - 1 && 'border-b')}
              >
                <td className="px-4 py-3 text-sm font-medium">{dist.inversionistaNombre}</td>
                <td className="px-4 py-3 text-right text-sm">{formatCurrency(dist.montoAPref)}</td>
                <td className="px-4 py-3 text-right text-sm">
                  {formatCurrency(dist.montoACapital)}
                </td>
                <td className="px-4 py-3 text-right text-sm">
                  {formatCurrency(dist.montoAUtilidad)}
                </td>
                <td className="text-muted-foreground px-4 py-3 text-right text-sm">
                  {dist.successFee > 0 ? `-${formatCurrency(dist.successFee)}` : '-'}
                </td>
                <td className="px-4 py-3 text-right text-sm font-semibold">
                  {formatCurrency(dist.montoNeto)}
                </td>
              </tr>
            ))}
          </tbody>
          <tfoot>
            <tr className="bg-muted/30 border-t-2">
              <td className="px-4 py-3 text-sm font-semibold">Totales</td>
              <td className="px-4 py-3 text-right text-sm font-semibold">
                {formatCurrency(result.totales.totalPref)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold">
                {formatCurrency(result.totales.totalCapital)}
              </td>
              <td className="px-4 py-3 text-right text-sm font-semibold">
                {formatCurrency(result.totales.totalUtilidad)}
              </td>
              <td className="text-muted-foreground px-4 py-3 text-right text-sm font-semibold">
                {result.totales.totalFees > 0
                  ? `-${formatCurrency(result.totales.totalFees)}`
                  : '-'}
              </td>
              <td className="px-4 py-3 text-right text-sm font-bold">
                {formatCurrency(result.totales.totalNeto)}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      {/* Summary */}
      <div className="bg-muted/30 flex items-center justify-between rounded-lg p-3 text-sm">
        <span className="text-muted-foreground">Monto distribuido:</span>
        <span className="font-semibold">{formatCurrency(result.totales.totalBruto)}</span>
      </div>
    </div>
  );
}
