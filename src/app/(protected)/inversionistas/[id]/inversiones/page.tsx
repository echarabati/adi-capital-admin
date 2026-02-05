/**
 * Inversionista Inversiones Tab
 *
 * Placeholder for inversiones list (links to INVE-001).
 *
 * @see INV-003
 */

import { Wallet } from 'lucide-react';

interface InversionesPageProps {
  params: Promise<{ id: string }>;
}

export default async function InversionesPage({ params }: InversionesPageProps) {
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
        <Wallet className="h-6 w-6" />
      </div>
      <h3 className="text-foreground mt-4 font-medium">Inversiones</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Lista de inversiones de este inversionista.
      </p>
      <p className="text-muted-foreground mt-4 text-xs">
        Pendiente: INVE-001 (Lista de inversiones)
      </p>
    </div>
  );
}
