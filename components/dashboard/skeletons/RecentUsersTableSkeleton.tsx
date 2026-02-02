import { Skeleton, SkeletonTable } from '@/components/ui/Skeleton';

export function RecentUsersTableSkeleton() {
  return (
    <div className="space-y-4">
      {/* Header */}
      <div>
        <Skeleton className="mb-2 h-7 w-48" />
        <Skeleton className="h-4 w-64" />
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-end gap-4">
        <div className="min-w-48 flex-1 space-y-2 lg:max-w-xs">
          <Skeleton className="h-3 w-12" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="min-w-40 space-y-2">
          <Skeleton className="h-3 w-8" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="min-w-32 space-y-2">
          <Skeleton className="h-3 w-10" />
          <Skeleton className="h-10 w-full" />
        </div>
        <div className="flex-1" />
        <Skeleton className="h-10 w-24" />
      </div>

      {/* Table */}
      <div
        className="overflow-hidden rounded-xl border p-4"
        style={{
          backgroundColor: 'var(--sidebar-bg)',
          borderColor: 'var(--sidebar-border)',
        }}
      >
        <SkeletonTable rows={5} />
      </div>
    </div>
  );
}
