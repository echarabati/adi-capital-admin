'use client';

/**
 * InversionSelector Component
 *
 * Dropdown for selecting an inversión, grouped by proyecto.
 * Used in MovimientoForm for APO/APO-D/DIS/DEV/FEE conceptos.
 *
 * @see MOV-003
 */

import { useMemo } from 'react';
import type { InversionSelectorItem } from '@/lib/actions/inversiones/inversiones-queries';

// =============================================================================
// Types
// =============================================================================

interface InversionSelectorProps {
  value?: string;
  onChange: (inversionId: string) => void;
  inversiones: InversionSelectorItem[];
  required?: boolean;
}

// =============================================================================
// Helpers
// =============================================================================

function formatMonto(monto: string): string {
  const num = parseFloat(monto);
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
  }).format(num);
}

// =============================================================================
// Component
// =============================================================================

export function InversionSelector({
  value,
  onChange,
  inversiones,
  required = false,
}: InversionSelectorProps) {
  // Group by proyecto
  const grouped = useMemo(() => {
    const groups: Record<string, { proyectoNombre: string; items: InversionSelectorItem[] }> = {};

    for (const inv of inversiones) {
      if (!groups[inv.proyectoId]) {
        groups[inv.proyectoId] = {
          proyectoNombre: inv.proyectoNombre,
          items: [],
        };
      }
      groups[inv.proyectoId].items.push(inv);
    }

    return Object.values(groups);
  }, [inversiones]);

  if (inversiones.length === 0) {
    return (
      <div className="text-muted-foreground rounded-lg border border-dashed p-3 text-sm">
        No hay inversiones disponibles en este fondo
      </div>
    );
  }

  return (
    <div>
      <label className="text-foreground mb-1.5 block text-sm font-medium">
        Inversión {required && <span className="text-rose-500">*</span>}
      </label>
      <select
        value={value || ''}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="border-input bg-background text-foreground focus:ring-primary w-full rounded-lg border px-3 py-2 text-sm focus:ring-2 focus:outline-none"
      >
        <option value="">Selecciona una inversión</option>
        {grouped.map((group) => (
          <optgroup key={group.proyectoNombre} label={group.proyectoNombre}>
            {group.items.map((inv) => (
              <option key={inv.id} value={inv.id}>
                {inv.inversionistaNombre} ({formatMonto(inv.compromiso)})
              </option>
            ))}
          </optgroup>
        ))}
      </select>
    </div>
  );
}
