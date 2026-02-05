/**
 * Inversionista Movimientos Tab
 *
 * Placeholder for movimientos list.
 *
 * @see INV-003
 */

import { ArrowLeftRight } from 'lucide-react';

interface MovimientosPageProps {
  params: Promise<{ id: string }>;
}

export default async function MovimientosPage({ params }: MovimientosPageProps) {
  const { id: _id } = await params;

  return (
    <div
      className="rounded-xl border p-8 text-center"
      style={{
        backgroundColor: 'var(--sidebar-bg)',
        borderColor: 'var(--sidebar-border)',
      }}
    >
      <div className="bg-primary/20 text-primary mx-auto flex h-12 w-12 items-center justify-center rounded-full">
        <ArrowLeftRight className="h-6 w-6" />
      </div>
      <h3 className="text-foreground mt-4 font-medium">Movimientos</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Historial de movimientos de capital de este inversionista.
      </p>
      <p className="text-muted-foreground mt-4 text-xs">Pendiente: MOV-002</p>
    </div>
  );
}
