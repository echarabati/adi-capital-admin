/**
 * Inversiones Tab (Placeholder)
 *
 * @see INVE-001
 */

import type { Metadata } from 'next';
import { DollarSign } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Inversiones | Proyecto',
  description: 'Inversiones del proyecto',
};

export default function InversionesPage() {
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
          <DollarSign className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Inversiones</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La lista de inversiones estará disponible en INVE-001.
        </p>
      </div>
    </div>
  );
}
