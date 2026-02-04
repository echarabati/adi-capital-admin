/**
 * Fondos List Page
 *
 * Lists all funds the user has access to based on RBAC.
 * - Super Admin: sees all active funds
 * - Admin de Fondo: sees only assigned funds
 *
 * @see FOND-001
 */

import { redirect } from 'next/navigation';
import type { Metadata } from 'next';
import { auth } from '@/lib/auth';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { FondosTable } from './FondosTable';

export const metadata: Metadata = {
  title: 'Fondos | ADI Capital',
  description: 'Gestión de fondos de inversión',
};

export default async function FondosPage() {
  // Auth check
  const session = await auth();
  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch fondos with RBAC filtering
  const fondos = await getFondos();

  return (
    <div className="container mx-auto py-6">
      <FondosTable fondos={fondos} userRole={session.user.role} />
    </div>
  );
}
