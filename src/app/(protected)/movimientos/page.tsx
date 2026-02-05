/**
 * Movimientos List Page
 *
 * Server component that fetches movimientos and renders DataTable.
 * Applies RBAC filtering via getMovimientos query.
 *
 * @see MOV-001, MOV-003, MOV-006
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getMovimientos } from '@/lib/actions/movimientos/movimientos-queries';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { getInversionesForSelector } from '@/lib/actions/inversiones/inversiones-queries';
import { getProyectosByFondo } from '@/lib/actions/proyectos/proyectos-queries';
import { getFundadores } from '@/lib/actions/inversionistas/inversionistas-queries';
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

  // Fetch inversiones, proyectos, and fundadores for all accessible fondos
  const [inversionesArrays, proyectosArrays, fundadoresArrays] = await Promise.all([
    Promise.all(fondos.map((f) => getInversionesForSelector(f.id))),
    Promise.all(fondos.map((f) => getProyectosByFondo(f.id))),
    Promise.all(fondos.map((f) => getFundadores(f.id))),
  ]);
  const inversiones = inversionesArrays.flat();
  const proyectos = proyectosArrays.flat().map((p) => ({
    id: p.id,
    nombre: p.nombre,
    fondoId: p.fondoId,
  }));
  const fundadores = fundadoresArrays.flat();

  return (
    <MovimientosTable
      movimientos={movimientos}
      fondos={fondos.map((f) => ({ id: f.id, nombre: f.nombre }))}
      inversiones={inversiones}
      proyectos={proyectos}
      fundadores={fundadores}
      initialFilters={{
        fondoId: params.fondoId,
        concepto: params.concepto,
        estado: params.estado,
      }}
    />
  );
}
