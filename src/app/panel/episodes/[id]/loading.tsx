import { Skeleton } from "@/components/ui/skeleton";

export default function EpisodesLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center gap-4">
                    <Skeleton className="h-10 w-10 rounded-md" />
                    <div>
                        <Skeleton className="h-8 w-48 mb-2" />
                        <Skeleton className="h-4 w-64" />
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <Skeleton className="h-6 w-32" />
                    <Skeleton className="h-10 w-36" />
                </div>
                <div className="space-y-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full rounded-xl" />
                    ))}
                </div>
            </div>
        </div>
    );
}
