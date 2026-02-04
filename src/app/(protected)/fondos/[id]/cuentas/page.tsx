/**
 * Cuentas Bancarias Tab Page
 *
 * Lists bank accounts for the current fund.
 * Placeholder - will be implemented in FOND-004.
 *
 * @see FOND-003
 */

import type { Metadata } from 'next';
import { CreditCard } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Cuentas Bancarias | Fondo',
  description: 'Cuentas bancarias del fondo',
};

export default function CuentasPage() {
  return (
    <div
      className="rounded-xl border p-8"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="flex flex-col items-center justify-center text-center">
        <div className="bg-primary/20 text-primary mb-4 flex h-12 w-12 items-center justify-center rounded-xl">
          <CreditCard className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Cuentas Bancarias</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La gestión de cuentas bancarias estará disponible en FOND-004.
        </p>
      </div>
    </div>
  );
}
