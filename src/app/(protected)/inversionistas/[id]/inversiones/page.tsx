/**
 * Inversiones Tab - Inversionista Context
 *
 * Displays list of investments for an investor.
 *
 * @see INVE-001
 */

import { getInversionesByInversionista } from '@/lib/actions/inversiones/inversiones-queries';
import { InversionistaInversionesTable } from './InversionistaInversionesTable';

interface InversionesPageProps {
  params: Promise<{ id: string }>;
}

export default async function InversionesPage({ params }: InversionesPageProps) {
  const { id: inversionistaId } = await params;

  const inversiones = await getInversionesByInversionista(inversionistaId);

  return <InversionistaInversionesTable inversiones={inversiones} />;
}
