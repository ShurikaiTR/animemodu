import { Skeleton } from "@/shared/components/skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-40 rounded-2xl bg-white/5" />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="bg-bg-secondary/40 border border-white/5 rounded-2xl p-6 space-y-6">
      <div className="flex justify-between items-center">
        <Skeleton className="h-6 w-48 bg-white/5" />
        <Skeleton className="h-8 w-24 bg-white/5" />
      </div>
      <div className="space-y-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-4">
            <Skeleton className="h-14 w-10 rounded bg-white/5" />
            <div className="flex-1 space-y-2">
              <Skeleton className="h-4 w-1/2 bg-white/5" />
              <Skeleton className="h-3 w-1/4 bg-white/5" />
            </div>
            <Skeleton className="h-6 w-16 rounded bg-white/5" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 border-b border-white/5">
        <div className="space-y-2">
          <Skeleton className="h-9 w-64 bg-white/5" />
          <Skeleton className="h-4 w-48 bg-white/5" />
        </div>
        <Skeleton className="h-11 w-32 rounded-xl bg-white/5" />
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TableSkeleton />
        <TableSkeleton />
      </div>
    </div>
  );
}

