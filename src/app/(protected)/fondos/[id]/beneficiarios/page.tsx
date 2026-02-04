/**
 * Beneficiarios Tab Page
 *
 * Lists beneficiaries for the current fund.
 *
 * @see FOND-005
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';
import { getBeneficiariosByFondo } from '@/lib/actions/beneficiarios/beneficiarios-queries';
import { BeneficiariosTable } from './BeneficiariosTable';

export const metadata: Metadata = {
  title: 'Beneficiarios | Fondo',
  description: 'Beneficiarios del fondo',
};

interface BeneficiariosPageProps {
  params: Promise<{ id: string }>;
}

export default async function BeneficiariosPage({ params }: BeneficiariosPageProps) {
  const { id: fondoId } = await params;

  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch beneficiarios
  const beneficiarios = await getBeneficiariosByFondo(fondoId);

  return (
    <BeneficiariosTable
      beneficiarios={beneficiarios}
      fondoId={fondoId}
      userRole={session.user.role}
    />
  );
}
