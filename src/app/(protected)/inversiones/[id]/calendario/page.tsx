/**
 * Calendario Tab - Inversion Context
 *
 * Payment schedule / capital calls for an investment.
 *
 * @see INVE-005, INVE-006
 */

import { CalendarioTable } from './_components/CalendarioTable';
import { getCalendarioPagosByInversion } from '@/lib/actions/calendario-pagos/calendario-pagos-queries';
import { getInversionById } from '@/lib/actions/inversiones/inversiones-queries';
import { notFound } from 'next/navigation';

interface CalendarioPageProps {
  params: Promise<{ id: string }>;
}

export default async function CalendarioPage({ params }: CalendarioPageProps) {
  const { id } = await params;

  // Fetch investment to get inversionistaId for APO generation
  const inversion = await getInversionById(id);
  if (!inversion) {
    notFound();
  }

  // Fetch capital calls for this investment
  const items = await getCalendarioPagosByInversion(id);

  return (
    <CalendarioTable inversionId={id} inversionistaId={inversion.inversionistaId} items={items} />
  );
}
