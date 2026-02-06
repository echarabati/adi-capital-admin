'use client';

/**
 * Step 4: Confirmation
 *
 * Final confirmation with destino selector.
 *
 * @see WIZ-001 AC: Step 4: Confirmación
 * @see WIZ-001 AC: Al crear DIS: capturar `destino`
 * @see INFRA-010 (destinoEnum)
 */

import { useId } from 'react';
import { cn } from '@/lib/utils/cn';
import { Card } from '@/components/ui/card';
import { CheckIcon, AlertTriangleIcon } from 'lucide-react';
import type { WizardData } from '../WizardContainer';

// =============================================================================
// Types
// =============================================================================

type DestinoOption = {
  value: 'a_pref' | 'a_capital' | 'a_utilidad';
  label: string;
  description: string;
};

const DESTINO_OPTIONS: DestinoOption[] = [
  {
    value: 'a_pref',
    label: 'A Preferente',
    description: 'Distribuir como pago de preferente acumulado',
  },
  {
    value: 'a_capital',
    label: 'A Capital',
    description: 'Distribuir como devolución de capital',
  },
  {
    value: 'a_utilidad',
    label: 'A Utilidad',
    description: 'Distribuir como utilidades/ganancias',
  },
];

// =============================================================================
// Step4Confirmation
// =============================================================================

interface Step4ConfirmationProps {
  wizardData: WizardData;
  onDestinoChange: (destino: 'a_pref' | 'a_capital' | 'a_utilidad') => void;
}

export function Step4Confirmation({ wizardData, onDestinoChange }: Step4ConfirmationProps) {
  const groupId = useId();

  const formattedMonto = new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
  }).format(wizardData.monto);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Confirmar Reparto</h2>
        <p className="text-muted-foreground text-sm">
          Revisa los detalles y selecciona el destino de la distribución.
        </p>
      </div>

      {/* Summary */}
      <div className="bg-muted/50 space-y-2 rounded-lg p-4">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Proyecto:</span>
          <span className="text-foreground font-medium">{wizardData.proyectoNombre}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Monto a distribuir:</span>
          <span className="text-foreground text-lg font-semibold">{formattedMonto}</span>
        </div>
      </div>

      {/* Destino selector */}
      <div>
        <label className="text-foreground mb-3 block text-sm font-medium" id={groupId}>
          Destino de la distribución
        </label>
        <div className="grid gap-3" role="radiogroup" aria-labelledby={groupId}>
          {DESTINO_OPTIONS.map((option) => {
            const isSelected = wizardData.destino === option.value;
            return (
              <Card
                key={option.value}
                onClick={() => onDestinoChange(option.value)}
                className={cn(
                  'hover:border-primary/50 cursor-pointer p-4 transition-all',
                  isSelected && 'border-primary bg-primary/5'
                )}
                role="radio"
                aria-checked={isSelected}
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onDestinoChange(option.value);
                  }
                }}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-foreground font-medium">{option.label}</span>
                    <p className="text-muted-foreground mt-0.5 text-sm">{option.description}</p>
                  </div>
                  {isSelected && (
                    <div className="bg-primary flex h-6 w-6 shrink-0 items-center justify-center rounded-full">
                      <CheckIcon className="text-primary-foreground h-4 w-4" />
                    </div>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Warning placeholder */}
      <div className="flex items-start gap-3 rounded-lg border border-yellow-500/30 bg-yellow-500/10 p-4">
        <AlertTriangleIcon className="mt-0.5 h-5 w-5 shrink-0 text-yellow-600" />
        <div className="text-sm">
          <p className="font-medium text-yellow-700">Funcionalidad en desarrollo</p>
          <p className="mt-1 text-yellow-600">
            La ejecución del reparto se implementará en WIZ-002 y WIZ-003 con el cálculo de cascada.
          </p>
        </div>
      </div>
    </div>
  );
}
