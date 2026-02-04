/**
 * Proyectos Tab Page
 *
 * Lists projects for the current fund.
 *
 * @see PROJ-001
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getProyectosByFondo } from '@/lib/actions/proyectos/proyectos-queries';
import { ProyectosTable } from './ProyectosTable';

export const metadata: Metadata = {
  title: 'Proyectos | Fondo',
  description: 'Proyectos del fondo',
};

interface ProyectosPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProyectosPage({ params }: ProyectosPageProps) {
  const { id: fondoId } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch proyectos
  const proyectos = await getProyectosByFondo(fondoId);

  return <ProyectosTable proyectos={proyectos} fondoId={fondoId} userRole={session.user.role} />;
}
