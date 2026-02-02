import { Skeleton } from '@/components/ui/Skeleton';
import { StatsCardsSkeleton } from './StatsCardsSkeleton';
import { RecentUsersTableSkeleton } from './RecentUsersTableSkeleton';
import { QuickActionsSkeleton } from './QuickActionsSkeleton';

export function DashboardSkeleton() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="mb-2 h-8 w-48" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Stats Cards */}
      <StatsCardsSkeleton />

      {/* Main Content Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Users Table - 2 cols */}
        <div className="lg:col-span-2">
          <RecentUsersTableSkeleton />
        </div>

        {/* Quick Actions - 1 col */}
        <div className="lg:mt-35">
          <QuickActionsSkeleton />
        </div>
      </div>
    </div>
  );
}
