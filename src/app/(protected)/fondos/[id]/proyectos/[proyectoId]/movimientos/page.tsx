/**
 * Movimientos Tab (Placeholder)
 *
 * @see MOV-001
 */

import type { Metadata } from 'next';
import { ArrowLeftRight } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Movimientos | Proyecto',
  description: 'Movimientos del proyecto',
};

export default function MovimientosPage() {
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
          <ArrowLeftRight className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Movimientos</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La lista de movimientos estará disponible en MOV-001.
        </p>
      </div>
    </div>
  );
}
