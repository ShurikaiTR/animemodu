import { Skeleton } from "@/shared/components/skeleton";
import { cn } from "@/shared/lib/utils";

export default function MovieCardSkeleton({ className }: { className?: string }) {
    return (
        <div className={cn("w-full aspect-[2/3] rounded-2xl overflow-hidden relative", className)}>
            <Skeleton className="w-full h-full bg-white/5" />

            <div className="absolute bottom-0 left-0 right-0 p-5 space-y-3">
                <Skeleton className="h-6 w-3/4 bg-white/10" />
                <div className="flex gap-2">
                    <Skeleton className="h-4 w-12 bg-white/10" />
                    <Skeleton className="h-4 w-16 bg-white/10" />
                </div>
            </div>
        </div>
    );
}

export function ArchiveGridSkeleton() {
    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5">
            {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </div>
    );
}
