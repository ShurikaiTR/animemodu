import Container from "@/shared/components/container";
import { Skeleton } from "@/shared/components/skeleton";

export default function NotificationsLoading() {
    return (
        <div className="min-h-screen bg-bg-main pb-20">
            <Container>
                {/* Header Skeleton */}
                <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
                    <div className="space-y-4">
                        <div className="flex items-center gap-3">
                            <Skeleton className="w-10 h-10 rounded-lg" />
                            <Skeleton className="h-12 w-48 rounded-xl" />
                        </div>
                        <Skeleton className="h-6 w-96 rounded-lg" />
                    </div>
                    <Skeleton className="h-10 w-40 rounded-xl" />
                </div>

                {/* Tabs Skeleton */}
                <div className="flex items-center gap-4 mb-8">
                    <Skeleton className="h-10 w-24 rounded-full" />
                    <Skeleton className="h-10 w-24 rounded-full" />
                </div>

                <div className="flex flex-col lg:flex-row gap-0 lg:gap-12 items-start">
                    {/* Sidebar Skeleton */}
                    <div className="w-full lg:w-64 shrink-0 mb-8 lg:mb-0 space-y-2">
                        {[1, 2, 3, 4].map(i => (
                            <Skeleton key={i} className="h-12 w-full rounded-xl" />
                        ))}
                    </div>

                    {/* Content Skeleton */}
                    <div className="flex-1 w-full space-y-12">
                        {[1, 2].map(group => (
                            <div key={group} className="space-y-6">
                                <div className="flex items-center gap-4">
                                    <Skeleton className="h-4 w-20" />
                                    <Skeleton className="h-px w-full" />
                                </div>
                                <div className="grid gap-4">
                                    {[1, 2, 3].map(item => (
                                        <Skeleton key={item} className="h-24 w-full rounded-[2rem]" />
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Container>
        </div>
    );
}
