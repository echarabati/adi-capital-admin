/**
 * Dashboard Page
 *
 * Protected page - requires authentication.
 * Shows stats, user table, and quick actions.
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth/auth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentUsersTable } from '@/components/dashboard/RecentUsersTable';
import { QuickActions } from '@/components/dashboard/QuickActions';

export const metadata: Metadata = {
  title: 'Dashboard',
  description: 'Tu panel de control',
};

export default async function DashboardPage() {
  const session = await auth();

  if (!session?.user) {
    redirect('/login');
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <p className="text-muted-foreground">
          Bienvenido de nuevo, {session.user.name || 'Usuario'}
        </p>
      </div>

      {/* Stats Cards */}
      <StatsCards />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users Table - 2 cols */}
        <div className="lg:col-span-2">
          <RecentUsersTable />
        </div>

        {/* Quick Actions - 1 col, offset to align with table */}
        <div className="lg:mt-35">
          <QuickActions user={session.user} />
        </div>
      </div>
    </div>
  );
}
