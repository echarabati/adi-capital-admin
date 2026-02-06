/**
 * Dashboard Page
 *
 * Protected page - requires authentication.
 * Shows fund stats and recent movements.
 * @see DASH-001
 */

import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';
import { auth } from '@/lib/auth/auth';
import { FundStatsCards } from '@/components/dashboard/FundStatsCards';
import { RecentMovementsTable } from '@/components/dashboard/RecentMovementsTable';
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

      {/* Recent Movements */}
      <Suspense fallback={<RecentMovementsTableSkeleton />}>
        <RecentMovementsTable />
      </Suspense>
    </div>
  );
}
