export default function CatalogLoading() {
    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <div className="h-9 w-48 bg-white/5 rounded animate-pulse mb-2" />
                        <div className="h-4 w-64 bg-white/5 rounded animate-pulse" />
                    </div>
                    <div className="h-10 w-28 bg-white/5 rounded animate-pulse" />
                </div>
            </div>

            <div className="h-14 w-full bg-white/5 rounded-xl animate-pulse" />

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="h-40 rounded-xl bg-white/[0.02] animate-pulse border border-white/5" />
                ))}
            </div>
        </div>
    );
}

