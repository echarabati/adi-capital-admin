/**
 * Proyectos Tab Page
 *
 * Lists projects for the current fund.
 * Placeholder - will be enhanced in PROJ-001.
 *
 * @see FOND-003
 */

import type { Metadata } from 'next';
import { FolderOpen } from 'lucide-react';

export const metadata: Metadata = {
  title: 'Proyectos | Fondo',
  description: 'Proyectos del fondo',
};

export default function ProyectosPage() {
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
          <FolderOpen className="h-6 w-6" />
        </div>
        <h3 className="text-foreground text-lg font-medium">Proyectos</h3>
        <p className="text-muted-foreground mt-1 text-sm">
          La lista de proyectos estará disponible en PROJ-001.
        </p>
      </div>
    </div>
  );
}
