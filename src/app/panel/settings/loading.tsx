export default function SettingsLoading() {
    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            {/* Header Skeleton */}
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <div className="h-9 w-48 bg-white/[0.02] animate-pulse rounded-md mb-2" />
                    <div className="h-5 w-72 bg-white/[0.02] animate-pulse rounded-md" />
                </div>
            </div>

            {/* Form Skeleton */}
            <div className="bg-bg-secondary/30 rounded-2xl border border-white/5 p-6 space-y-6">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="space-y-2">
                        <div className="h-5 w-24 bg-white/[0.02] animate-pulse rounded" />
                        <div className="h-12 w-full bg-white/[0.02] animate-pulse rounded-xl" />
                        <div className="h-4 w-48 bg-white/[0.02] animate-pulse rounded" />
                    </div>
                ))}

                {/* Button Skeleton */}
                <div className="pt-4 border-t border-white/5">
                    <div className="h-12 w-40 bg-primary/20 animate-pulse rounded-xl" />
                </div>
            </div>
        </div>
    );
}

