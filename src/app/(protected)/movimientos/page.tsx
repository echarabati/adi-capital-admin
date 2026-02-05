/**
 * Movimientos List Page
 *
 * Server component that fetches movimientos and renders DataTable.
 * Applies RBAC filtering via getMovimientos query.
 *
 * @see MOV-001
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovimientos } from '@/lib/actions/movimientos/movimientos-queries';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { MovimientosTable } from './MovimientosTable';

interface PageProps {
  searchParams: Promise<{
    fondoId?: string;
    concepto?: string;
    estado?: string;
  }>;
}

export default async function MovimientosPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;

  // Fetch data with RBAC
  const [movimientos, fondos] = await Promise.all([
    getMovimientos({
      fondoId: params.fondoId,
      concepto: params.concepto,
      estado: params.estado,
    }),
    getFondos(),
  ]);

  return (
    <MovimientosTable
      movimientos={movimientos}
      fondos={fondos.map((f) => ({ id: f.id, nombre: f.nombre }))}
      initialFilters={{
        fondoId: params.fondoId,
        concepto: params.concepto,
        estado: params.estado,
      }}
    />
  );
}
