import { Skeleton } from "@/shared/components/skeleton";

export function TableSkeleton() {
    return (
        <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl animate-in fade-in duration-500">
            <div className="p-6 border-b border-white/5 flex items-center justify-between">
                <div>
                    <Skeleton className="h-8 w-48 bg-white/5 mb-2" />
                    <Skeleton className="h-4 w-64 bg-white/5" />
                </div>
                <Skeleton className="h-10 w-32 bg-white/5" />
            </div>

            <div className="relative group w-full p-4 border-b border-white/5">
                <Skeleton className="h-14 w-full bg-white/5 rounded-xl" />
            </div>

            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="h-12 px-4 w-[40%]"><Skeleton className="h-4 w-20 bg-white/5" /></th>
                            <th className="h-12 px-4"><Skeleton className="h-4 w-20 bg-white/5" /></th>
                            <th className="h-12 px-4"><Skeleton className="h-4 w-20 bg-white/5" /></th>
                            <th className="h-12 px-4 w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="border-b border-white/5">
                                <td className="p-4">
                                    <div className="flex items-center gap-4">
                                        <Skeleton className="w-12 h-16 rounded-md bg-white/5" />
                                        <div className="space-y-2">
                                            <Skeleton className="h-4 w-32 bg-white/5" />
                                            <Skeleton className="h-3 w-24 bg-white/5" />
                                            <div className="flex gap-2">
                                                <Skeleton className="h-5 w-12 bg-white/5 rounded-full" />
                                                <Skeleton className="h-5 w-16 bg-white/5 rounded-full" />
                                            </div>
                                        </div>
                                    </div>
                                </td>
                                <td className="p-4">
                                    <div className="space-y-2">
                                        <Skeleton className="h-4 w-12 bg-white/5" />
                                        <Skeleton className="h-3 w-16 bg-white/5" />
                                    </div>
                                </td>
                                <td className="p-4">
                                    <Skeleton className="h-6 w-24 bg-white/5 rounded-full" />
                                </td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-1">
                                        <Skeleton className="h-8 w-8 rounded-md bg-white/5" />
                                        <Skeleton className="h-8 w-8 rounded-md bg-white/5" />
                                        <Skeleton className="h-8 w-8 rounded-md bg-white/5" />
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
