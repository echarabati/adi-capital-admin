/**
 * Movimientos List Page
 *
 * Server component that fetches movimientos and renders DataTable.
 * Applies RBAC filtering via getMovimientos query.
 *
 * @see MOV-001, MOV-003
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovimientos } from '@/lib/actions/movimientos/movimientos-queries';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { getInversionesForSelector } from '@/lib/actions/inversiones/inversiones-queries';
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

  // Fetch inversiones for all accessible fondos (for selector)
  const inversionesPromises = fondos.map((f) => getInversionesForSelector(f.id));
  const inversionesArrays = await Promise.all(inversionesPromises);
  const inversiones = inversionesArrays.flat();

  return (
    <MovimientosTable
      movimientos={movimientos}
      fondos={fondos.map((f) => ({ id: f.id, nombre: f.nombre }))}
      inversiones={inversiones}
      initialFilters={{
        fondoId: params.fondoId,
        concepto: params.concepto,
        estado: params.estado,
      }}
    />
  );
}
