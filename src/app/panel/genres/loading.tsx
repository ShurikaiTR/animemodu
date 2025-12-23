export default function GenresLoading() {
    return (
        <div className="space-y-8 animate-pulse">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <div className="h-8 w-32 bg-white/10 rounded-lg mb-2" />
                    <div className="h-4 w-64 bg-white/5 rounded" />
                </div>
            </div>

            <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden">
                <div className="p-6 border-b border-white/5">
                    <div className="h-6 w-24 bg-white/10 rounded" />
                </div>
                <div className="divide-y divide-white/5">
                    {Array.from({ length: 10 }).map((_, i) => (
                        <div key={i} className="p-4 flex items-center justify-between">
                            <div className="h-5 w-32 bg-white/5 rounded" />
                            <div className="h-5 w-20 bg-white/5 rounded" />
                            <div className="h-5 w-16 bg-white/5 rounded" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
