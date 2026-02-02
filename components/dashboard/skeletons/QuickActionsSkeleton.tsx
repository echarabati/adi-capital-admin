import { Skeleton } from '@/components/ui/Skeleton';

export function QuickActionsSkeleton() {
  return (
    <div
      className="bg-card rounded-xl border p-4 shadow-sm"
      style={{ borderColor: 'var(--card-border)' }}
    >
      {/* User Info Header */}
      <div className="mb-4 border-b pb-4" style={{ borderColor: 'var(--border)' }}>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="min-w-0 flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
        </div>
      </div>

      {/* Actions List */}
      <div className="space-y-1">
        <Skeleton className="mb-2 h-3 w-24" />
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3 rounded-lg p-2">
            <Skeleton className="h-5 w-5" />
            <div className="flex-1 space-y-1.5">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-3 w-32" />
            </div>
          </div>
        ))}

        {/* Logout Button mockup */}
        <div className="mt-2 flex items-center gap-3 rounded-lg p-2">
          <Skeleton className="h-5 w-5" />
          <div className="flex-1 space-y-1.5">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-3 w-32" />
          </div>
        </div>
      </div>
    </div>
  );
}
