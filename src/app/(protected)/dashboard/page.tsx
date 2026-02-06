/**
 * Dashboard Page
 *
 * Protected page - requires authentication.
 * Shows fund stats, recent movements, and quick actions.
 * @see DASH-001
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth/auth';
import { FundStatsCards } from '@/components/dashboard/FundStatsCards';
import { RecentMovementsTable } from '@/components/dashboard/RecentMovementsTable';
import { QuickActions } from '@/components/dashboard/QuickActions';
import {
  FundStatsCardsSkeleton,
  RecentMovementsTableSkeleton,
} from '@/components/dashboard/skeletons/DashboardSkeletons';

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
      <Suspense fallback={<FundStatsCardsSkeleton />}>
        <FundStatsCards />
      </Suspense>

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Movements Table - 2 cols */}
        <div className="min-w-0 lg:col-span-2">
          <Suspense fallback={<RecentMovementsTableSkeleton />}>
            <RecentMovementsTable />
          </Suspense>
        </div>

        {/* Quick Actions - constrained width on mobile, full on desktop */}
        <div className="max-w-sm lg:mt-35 lg:max-w-none">
          <QuickActions user={session.user} />
        </div>
      </div>
    </div>
  );
}
