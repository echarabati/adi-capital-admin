/**
 * Cuentas Bancarias Tab Page
 *
 * Lists bank accounts for the current fund.
 *
 * @see FOND-004
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getCuentasByFondo } from '@/lib/actions/cuentas-bancarias/cuentas-bancarias-queries';
import { CuentasBancariasTable } from './CuentasBancariasTable';

export const metadata: Metadata = {
  title: 'Cuentas Bancarias | Fondo',
  description: 'Cuentas bancarias del fondo',
};

interface CuentasPageProps {
  params: Promise<{ id: string }>;
}

export default async function CuentasPage({ params }: CuentasPageProps) {
  const { id: fondoId } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch cuentas
  const cuentas = await getCuentasByFondo(fondoId);

  return <CuentasBancariasTable cuentas={cuentas} fondoId={fondoId} userRole={session.user.role} />;
}
