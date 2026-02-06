/**
 * RecentMovementsTable Component
 *
 * Dashboard table showing the 10 most recent movements.
 * Server component that fetches real data.
 *
 * @see DASH-001
 */

import Link from 'next/link';
import { ArrowRight, CheckCircle, Clock, XCircle } from 'lucide-react';
import { getRecentMovimientos } from '@/lib/actions/dashboard/dashboard-queries';

// Concept badge colors
const conceptoColors: Record<string, { bg: string; text: string }> = {
  APO: { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
  'APO-D': { bg: 'bg-emerald-500/20', text: 'text-emerald-500' },
  DIS: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
  DEV: { bg: 'bg-blue-500/20', text: 'text-blue-500' },
  FEE: { bg: 'bg-purple-500/20', text: 'text-purple-500' },
  INV: { bg: 'bg-amber-500/20', text: 'text-amber-500' },
  'INV-D': { bg: 'bg-amber-500/20', text: 'text-amber-500' },
  RET: { bg: 'bg-teal-500/20', text: 'text-teal-500' },
  GAS: { bg: 'bg-red-500/20', text: 'text-red-500' },
  GASP: { bg: 'bg-red-500/20', text: 'text-red-500' },
};

function getConceptoColor(concepto: string) {
  return conceptoColors[concepto] || { bg: 'bg-gray-500/20', text: 'text-gray-500' };
}

/**
 * Format date as short Spanish format
 */
function formatDate(date: Date): string {
  return new Intl.DateTimeFormat('es-MX', {
    day: 'numeric',
    month: 'short',
  }).format(new Date(date));
}

/**
 * Format currency with symbol
 */
function formatMonto(monto: string, moneda: string): string {
  const num = parseFloat(monto);
  const symbols: Record<string, string> = {
    MXN: '$',
    USD: 'US$',
    EUR: '€',
    ILS: '₪',
  };
  const symbol = symbols[moneda] || moneda;
  return `${symbol}${num.toLocaleString('es-MX', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

/**
 * Estado badge component
 */
function EstadoBadge({ estado }: { estado: string }) {
  switch (estado) {
    case 'confirmado':
      return (
        <span className="inline-flex items-center gap-1 text-sm text-green-500">
          <CheckCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Confirmado</span>
        </span>
      );
    case 'borrador':
      return (
        <span className="inline-flex items-center gap-1 text-sm text-amber-500">
          <Clock className="h-4 w-4" />
          <span className="hidden sm:inline">Borrador</span>
        </span>
      );
    case 'cancelado':
      return (
        <span className="inline-flex items-center gap-1 text-sm text-red-500">
          <XCircle className="h-4 w-4" />
          <span className="hidden sm:inline">Cancelado</span>
        </span>
      );
    default:
      return <span className="text-muted-foreground text-sm">{estado}</span>;
  }
}

export async function RecentMovementsTable({ fondoId }: { fondoId?: string }) {
  const movimientos = await getRecentMovimientos(fondoId, 10);

  if (movimientos.length === 0) {
    return (
      <div className="min-w-0 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-foreground text-lg font-semibold">Movimientos Recientes</h2>
            <p className="text-muted-foreground text-sm">Últimas transacciones</p>
          </div>
        </div>
        <div
          className="flex flex-col items-center justify-center rounded-xl border py-12"
          style={{
            backgroundColor: 'var(--sidebar-bg)',
            borderColor: 'var(--sidebar-border)',
          }}
        >
          <Clock className="text-muted-foreground mb-3 h-10 w-10" />
          <p className="text-muted-foreground">No hay movimientos registrados</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-w-0 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-foreground text-lg font-semibold">Movimientos Recientes</h2>
          <p className="text-muted-foreground text-sm">Últimas transacciones</p>
        </div>
        <Link
          href="/movimientos"
          className="text-primary hover:text-primary/80 flex items-center gap-1 text-sm font-medium transition-colors"
        >
          Ver todos
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      {/* Table */}
      <div
        className="scrollbar-auto w-full overflow-x-auto rounded-xl border"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <table className="w-full min-w-[500px]">
          <thead>
            <tr className="border-b border-white/5 text-left">
              <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
                Fecha
              </th>
              <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
                Concepto
              </th>
              <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
                Monto
              </th>
              <th className="text-muted-foreground hidden px-4 py-3 text-xs font-medium tracking-wide uppercase md:table-cell">
                Referencia
              </th>
              <th className="text-muted-foreground px-4 py-3 text-xs font-medium tracking-wide uppercase">
                Estado
              </th>
            </tr>
          </thead>
          <tbody>
            {movimientos.map((mov) => {
              const colors = getConceptoColor(mov.concepto);
              const referencia = mov.inversionista?.nombre || mov.proyecto?.nombre || '—';

              return (
                <tr
                  key={mov.id}
                  className="border-b border-white/5 transition-colors last:border-0 hover:bg-white/5"
                >
                  <td className="text-muted-foreground px-4 py-3 text-sm">
                    {formatDate(mov.fechaMovimiento)}
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors.bg} ${colors.text}`}
                    >
                      {mov.concepto}
                    </span>
                  </td>
                  <td className="text-foreground px-4 py-3 text-sm font-medium">
                    {formatMonto(mov.monto, mov.moneda)}
                  </td>
                  <td className="text-muted-foreground hidden truncate px-4 py-3 text-sm md:table-cell">
                    {referencia}
                  </td>
                  <td className="px-4 py-3">
                    <EstadoBadge estado={mov.estado} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
