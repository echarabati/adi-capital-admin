/**
 * Inversionistas List Page
 *
 * Server component that fetches inversionistas and renders DataTable.
 * Applies RBAC filtering via getInversionistas query.
 *
 * @see INV-001
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getInversionistas } from '@/lib/actions/inversionistas/inversionistas-queries';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { InversionistasTable } from './InversionistasTable';

interface PageProps {
  searchParams: Promise<{ fondoId?: string }>;
}

export default async function InversionistasPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;
  const fondoId = params.fondoId;

  // Fetch data with RBAC
  const [inversionistas, fondos] = await Promise.all([getInversionistas({ fondoId }), getFondos()]);

  return (
    <InversionistasTable
      inversionistas={inversionistas}
      fondos={fondos.map((f) => ({ id: f.id, nombre: f.nombre }))}
      initialFondoId={fondoId}
    />
  );
}
