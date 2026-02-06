/**
 * FundStatsCardsSkeleton
 *
 * Loading skeleton for FundStatsCards component.
 * Matches the layout of the actual component.
 */

export function FundStatsCardsSkeleton() {
  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      {[...Array(4)].map((_, i) => (
        <div
          key={i}
          className="bg-card animate-pulse rounded-xl border border-white/10 p-5 shadow-sm"
        >
          <div className="flex items-center justify-between">
            <div className="h-9 w-9 rounded-lg bg-white/10" />
          </div>
          <div className="mt-3 space-y-2">
            <div className="h-4 w-24 rounded bg-white/10" />
            <div className="h-8 w-32 rounded bg-white/10" />
          </div>
        </div>
      ))}
    </div>
  );
}

/**
 * RecentMovementsTableSkeleton
 *
 * Loading skeleton for RecentMovementsTable component.
 */

export function RecentMovementsTableSkeleton() {
  return (
    <div className="min-w-0 animate-pulse space-y-4">
      <div className="flex items-center justify-between">
        <div className="space-y-2">
          <div className="h-5 w-48 rounded bg-white/10" />
          <div className="h-4 w-32 rounded bg-white/10" />
        </div>
        <div className="h-5 w-20 rounded bg-white/10" />
      </div>
      <div
        className="rounded-xl border"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/5">
              {[...Array(5)].map((_, i) => (
                <th key={i} className="px-4 py-3">
                  <div className="h-3 w-16 rounded bg-white/10" />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...Array(5)].map((_, i) => (
              <tr key={i} className="border-b border-white/5 last:border-0">
                <td className="px-4 py-3">
                  <div className="h-4 w-12 rounded bg-white/10" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-5 w-14 rounded-full bg-white/10" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-20 rounded bg-white/10" />
                </td>
                <td className="hidden px-4 py-3 md:table-cell">
                  <div className="h-4 w-28 rounded bg-white/10" />
                </td>
                <td className="px-4 py-3">
                  <div className="h-4 w-12 rounded bg-white/10" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/**
 * DashboardPageSkeleton
 *
 * Combined skeleton for the full dashboard page.
 * Used by loading.tsx for route-level loading state.
 */
export function DashboardPageSkeleton() {
  return (
    <div className="space-y-6">
      <FundStatsCardsSkeleton />
      <RecentMovementsTableSkeleton />
    </div>
  );
}
