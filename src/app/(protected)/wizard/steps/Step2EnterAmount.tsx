'use client';

/**
 * Step 2: Enter Amount
 *
 * User enters the total amount to distribute.
 *
 * @see WIZ-001 AC: Step 2: Ingresar monto total
 */

import { useId } from 'react';
import { Input } from '@/components/ui/input';

// =============================================================================
// Step2EnterAmount
// =============================================================================

interface Step2EnterAmountProps {
  monto: number;
  onMontoChange: (monto: number) => void;
}

export function Step2EnterAmount({ monto, onMontoChange }: Step2EnterAmountProps) {
  const inputId = useId();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9.]/g, '');
    const numValue = parseFloat(value) || 0;
    onMontoChange(numValue);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-foreground text-lg font-semibold">Monto a Distribuir</h2>
        <p className="text-muted-foreground text-sm">
          Ingresa el monto total que se distribuirá entre los inversionistas.
        </p>
      </div>

      <div className="max-w-md">
        <label htmlFor={inputId} className="text-foreground mb-2 block text-sm font-medium">
          Monto Total (MXN)
        </label>
        <div className="relative">
          <span className="text-muted-foreground absolute top-1/2 left-3 -translate-y-1/2">$</span>
          <Input
            id={inputId}
            type="text"
            inputMode="decimal"
            placeholder="0.00"
            value={monto > 0 ? monto.toLocaleString('en-US', { minimumFractionDigits: 2 }) : ''}
            onChange={handleChange}
            className="pl-7 text-lg"
          />
        </div>
        {monto > 0 && (
          <p className="text-muted-foreground mt-2 text-sm">
            {new Intl.NumberFormat('es-MX', {
              style: 'currency',
              currency: 'MXN',
            }).format(monto)}
          </p>
        )}
      </div>
    </div>
  );
}
