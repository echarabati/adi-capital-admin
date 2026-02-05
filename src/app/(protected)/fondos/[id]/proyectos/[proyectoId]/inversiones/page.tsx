/**
 * Inversiones Tab - Proyecto Context
 *
 * Displays list of investments for a project.
 *
 * @see INVE-001
 */

import type { Metadata } from 'next';
import { getInversionesByProyecto } from '@/lib/actions/inversiones/inversiones-queries';
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

  const inversiones = await getInversionesByProyecto(proyectoId);

  return <InversionesTable inversiones={inversiones} fondoId={fondoId} />;
}
