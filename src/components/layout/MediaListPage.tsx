import { Suspense, type ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import Container from "@/components/ui/container";
import MovieCardSkeleton from "@/components/ui/MovieCard/skeleton";

interface MediaListPageProps {
    title: string;
    description: string;
    icon: LucideIcon;
    children: ReactNode;
    skeletonCount?: number;
}

function GridSkeleton({ count = 12 }: { count?: number }) {
    return (
        <>
            {Array.from({ length: count }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </>
    );
}

export default function MediaListPage({
    title,
    description,
    icon: Icon,
    children,
    skeletonCount = 12,
}: MediaListPageProps) {
    return (
        <div className="min-h-screen pb-20">
            <Container>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white font-rubik flex items-center gap-3 mb-2">
                            <Icon className="w-8 h-8 text-primary" />
                            {title}
                        </h1>
                        <p className="text-white/60 text-lg">{description}</p>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8">
                    <Suspense fallback={<GridSkeleton count={skeletonCount} />}>
                        {children}
                    </Suspense>
                </div>
            </Container>
        </div>
    );
}
