'use client';

/**
 * ConceptoSelector Component
 *
 * Grid of movement type badges organized by category.
 * Click to select a concept for the new movement.
 *
 * @see MOV-002
 */

import { useMemo } from 'react';
import {
  CONCEPTO_GROUPS,
  CONCEPTO_CONFIG,
  type Concepto,
} from '@/lib/validations/movimientos/movimientos-validation';

// =============================================================================
// Types
// =============================================================================

interface ConceptoSelectorProps {
  value?: Concepto;
  onChange: (concepto: Concepto) => void;
}

// =============================================================================
// Helpers
// =============================================================================

function getColorClasses(color: string, isSelected: boolean): string {
  const base = isSelected ? 'ring-2 ring-offset-2' : '';

  switch (color) {
    case 'emerald':
      return `${base} bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/30 ${isSelected ? 'ring-emerald-500' : ''}`;
    case 'rose':
      return `${base} bg-rose-500/20 text-rose-600 dark:text-rose-400 hover:bg-rose-500/30 ${isSelected ? 'ring-rose-500' : ''}`;
    case 'blue':
      return `${base} bg-blue-500/20 text-blue-600 dark:text-blue-400 hover:bg-blue-500/30 ${isSelected ? 'ring-blue-500' : ''}`;
    case 'purple':
      return `${base} bg-purple-500/20 text-purple-600 dark:text-purple-400 hover:bg-purple-500/30 ${isSelected ? 'ring-purple-500' : ''}`;
    case 'amber':
      return `${base} bg-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/30 ${isSelected ? 'ring-amber-500' : ''}`;
    case 'cyan':
      return `${base} bg-cyan-500/20 text-cyan-600 dark:text-cyan-400 hover:bg-cyan-500/30 ${isSelected ? 'ring-cyan-500' : ''}`;
    default:
      return `${base} bg-gray-500/20 text-gray-600 dark:text-gray-400 hover:bg-gray-500/30 ${isSelected ? 'ring-gray-500' : ''}`;
  }
}

// =============================================================================
// Component
// =============================================================================

export function ConceptoSelector({ value, onChange }: ConceptoSelectorProps) {
  const categories = useMemo(() => {
    return Object.entries(CONCEPTO_GROUPS).map(([category, conceptos]) => ({
      name: category,
      conceptos: conceptos.map((c) => ({
        code: c as Concepto,
        ...CONCEPTO_CONFIG[c as Concepto],
      })),
    }));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-foreground mb-2 text-sm font-medium">
          Selecciona el tipo de movimiento
        </h3>
        <p className="text-muted-foreground text-xs">
          Escoge la categoría y concepto que mejor describa esta transacción
        </p>
      </div>

      {categories.map((category) => (
        <div key={category.name}>
          <h4 className="text-muted-foreground mb-2 text-xs font-medium tracking-wider uppercase">
            {category.name}
          </h4>
          <div className="flex flex-wrap gap-2">
            {category.conceptos.map((concepto) => {
              const isSelected = value === concepto.code;
              return (
                <button
                  key={concepto.code}
                  type="button"
                  onClick={() => onChange(concepto.code)}
                  className={`rounded-full px-3 py-1.5 text-sm font-medium transition-all ${getColorClasses(concepto.color, isSelected)}`}
                >
                  {concepto.code} - {concepto.label}
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
