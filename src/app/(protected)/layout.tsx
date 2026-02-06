/**
 * Protected Layout
 *
 * Layout for authenticated pages.
 * Uses DashboardLayout with sidebar and header.
 *
 * Fetches fresh user data from DB to ensure avatar/name are up-to-date
 * without requiring logout/login (CRUD-003).
 *
 * Also fetches user's accessible fondos for FundSelector (DASH-002).
 */

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { getFreshUser } from '@/lib/db/queries/users';
import { getFondos } from '@/lib/actions/fondos/fondos-queries';
import { SELECTED_FUND_COOKIE_NAME } from '@/lib/utils/fund-cookie';
import { DashboardShell } from './DashboardShell';

export default async function ProtectedLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user?.id) {
    redirect('/login');
  }

  // Fetch fresh user data from DB (CRUD-003)
  const freshUser = await getFreshUser(session.user.id);

  // If user was deleted, sign them out
  if (!freshUser) {
    redirect('/api/auth/signout');
  }

  // Merge fresh data with session fallback
  const user = {
    id: session.user.id,
    name: freshUser.name ?? session.user.name,
    email: freshUser.email ?? session.user.email,
    image: freshUser.image ?? session.user.image,
    role: freshUser.role ?? session.user.role,
  };

  // Fetch user's accessible fondos (DASH-002)
  const fondos = await getFondos();
  const fondosForSelector = fondos.map((f) => ({ id: f.id, nombre: f.nombre }));

  // Read selected fondo from cookie
  const cookieStore = await cookies();
  const selectedFondoId = cookieStore.get(SELECTED_FUND_COOKIE_NAME)?.value ?? null;

  return (
    <DashboardShell user={user} fondos={fondosForSelector} initialFondoId={selectedFondoId}>
      {children}
    </DashboardShell>
  );
}
