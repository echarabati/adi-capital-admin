'use client';

/**
 * FundadorSelector Component
 *
 * Dropdown for selecting a founder/partner for Socios movements.
 * Only shows inversionistas where esFundador = true.
 *
 * @see MOV-009
 */

import type { FundadorSelectorItem } from '@/lib/actions/inversionistas/inversionistas-queries';

// =============================================================================
// Types
// =============================================================================

interface FundadorSelectorProps {
  value?: string;
  onChange: (inversionistaId: string) => void;
  fundadores: FundadorSelectorItem[];
  required?: boolean;
}

// =============================================================================
// Component
// =============================================================================

export function FundadorSelector({
  value,
  onChange,
  fundadores,
  required = false,
}: FundadorSelectorProps) {
  if (fundadores.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-amber-500/50 bg-amber-500/10 p-3">
        <p className="text-sm text-amber-600 dark:text-amber-400">
          No hay fundadores registrados en este fondo.
        </p>
        <p className="text-muted-foreground mt-1 text-xs">
          Para crear movimientos de socios, primero marca a un inversionista como fundador.
        </p>
      </div>
    );
  }

  return (
    <div>
      <label className="text-foreground mb-1.5 block text-sm font-medium">
        Fundador/Socio {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      >
        <option value="">Selecciona un fundador</option>
        {fundadores.map((f) => (
          <option key={f.id} value={f.id}>
            {f.nombre}
            {f.porcentajePropiedad ? ` (${f.porcentajePropiedad}%)` : ''}
          </option>
        ))}
      </select>
      <p className="text-muted-foreground mt-1 text-xs">
        Solo se muestran inversionistas marcados como fundadores
      </p>
    </div>
  );
}
