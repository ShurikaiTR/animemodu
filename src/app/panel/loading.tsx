import { Skeleton } from "@/shared/components/skeleton";

export function StatsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {Array.from({ length: 4 }).map((_, i) => (
        <Skeleton key={i} className="h-32 rounded-xl" />
      ))}
    </div>
  );
}

export function TableSkeleton() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-48" />
      <div className="space-y-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-16 w-full rounded-lg" />
        ))}
      </div>
    </div>
  );
}

export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
        <Skeleton className="h-10 w-64" />
        <Skeleton className="h-12 w-32" />
      </div>

      <StatsSkeleton />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
        <TableSkeleton />
        <TableSkeleton />
      </div>
    </div>
  );
}

