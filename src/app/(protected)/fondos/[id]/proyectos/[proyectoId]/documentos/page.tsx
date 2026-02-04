/**
 * Documentos Tab (Placeholder)
 *
 * @see DOC-001
 */

import type { Metadata } from 'next';
import { FileText } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Documentos | Proyecto',
  description: 'Documentos del proyecto',
};

export default function DocumentosPage() {
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
          <FileText className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Documentos</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La lista de documentos estará disponible en DOC-001.
        </p>
      </div>
    </div>
  );
}
