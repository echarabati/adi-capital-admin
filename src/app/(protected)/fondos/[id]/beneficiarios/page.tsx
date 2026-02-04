/**
 * Beneficiarios Tab Page
 *
 * Lists beneficiaries for the current fund.
 * Placeholder - will be implemented in FOND-005.
 *
 * @see FOND-003
 */

import type { Metadata } from 'next';
import { Users } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Beneficiarios | Fondo',
  description: 'Beneficiarios del fondo',
};

export default function BeneficiariosPage() {
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
          <Users className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Beneficiarios</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La gestión de beneficiarios estará disponible en FOND-005.
        </p>
      </div>
    </div>
  );
}
