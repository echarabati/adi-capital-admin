/**
 * Inversiones Tab - Proyecto Context
 *
 * Displays list of investments for a project.
 *
 * @see INVE-001, INVE-002
 */

import type { Metadata } from 'next';
import {
  getInversionesByProyecto,
  getInversionistasByFondo,
} from '@/lib/actions/inversiones/inversiones-queries';
import { getProyectoById } from '@/lib/actions/proyectos/proyectos-queries';
import { InversionesTable } from './InversionesTable';

export const metadata: Metadata = {
  title: 'Inversiones | Proyecto',
  description: 'Inversiones del proyecto',
};

interface InversionesPageProps {
  params: Promise<{ id: string; proyectoId: string }>;
}

export default async function InversionesPage({ params }: InversionesPageProps) {
  const { id: fondoId, proyectoId } = await params;

  // Fetch inversiones and inversionistas for the dropdown
  const [inversiones, proyecto] = await Promise.all([
    getInversionesByProyecto(proyectoId),
    getProyectoById(proyectoId),
  ]);

  // Get inversionistas for the form dropdown
  const inversionistas = proyecto ? await getInversionistasByFondo(proyecto.fondoId) : [];

  return (
    <InversionesTable
      inversiones={inversiones}
      fondoId={fondoId}
      proyectoId={proyectoId}
      inversionistas={inversionistas}
    />
  );
}
