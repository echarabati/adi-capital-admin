/**
 * Noticias List Page
 *
 * Server component that fetches noticias and renders DataTable.
 * Applies RBAC filtering via getNoticias query.
 *
 * @see NEWS-001
 */

import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getNoticias } from '@/lib/actions/noticias/noticias-queries';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { NoticiasTable } from './NoticiasTable';

interface PageProps {
  searchParams: Promise<{ fondoId?: string; estado?: string }>;
}

export default async function NoticiasPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  const params = await searchParams;
  const fondoId = params.fondoId;
  const estado = params.estado as 'borrador' | 'publicado' | undefined;

  // Fetch data with RBAC
  const [noticias, fondos] = await Promise.all([getNoticias({ fondoId, estado }), getFondos()]);

  return (
    <NoticiasTable
      noticias={noticias}
      fondos={fondos.map((f) => ({ id: f.id, nombre: f.nombre }))}
      initialFondoId={fondoId}
      initialEstado={estado}
    />
  );
}
