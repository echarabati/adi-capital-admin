/**
 * Inversionista Documentos Tab
 *
 * Placeholder for documentos list.
 *
 * @see INV-003
 */

import { FileText } from 'lucide-react';

interface DocumentosPageProps {
  params: Promise<{ id: string }>;
}

export default async function DocumentosPage({ params }: DocumentosPageProps) {
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
        <FileText className="h-6 w-6" />
      </div>
      <h3 className="text-foreground mt-4 font-medium">Documentos</h3>
      <p className="text-muted-foreground mt-1 text-sm">
        Documentos asociados a este inversionista.
      </p>
      <p className="text-muted-foreground mt-4 text-xs">Pendiente: DRIVE-001</p>
    </div>
  );
}
