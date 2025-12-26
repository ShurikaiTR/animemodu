import Container from "@/components/ui/container";
import { Film } from "lucide-react";
import MovieCardSkeleton from "@/components/ui/MovieCard/skeleton";

export default function FilmlerLoading() {
    return (
        <div className="min-h-screen pb-20">
            <Container>
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
                    <div>
                        <h1 className="text-3xl md:text-4xl font-bold text-white font-rubik flex items-center gap-3 mb-2">
                            <Film className="w-8 h-8 text-primary" />
                            Anime Filmleri
                        </h1>
                        <p className="text-white/60 text-lg">
                            Soluksuz izleyeceğin anime filmleri burada.
                        </p>
                    </div>
                </div>

                {/* Grid Skeleton */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8">
                    {Array.from({ length: 12 }).map((_, i) => (
                        <MovieCardSkeleton key={i} />
                    ))}
                </div>
            </Container>
        </div>
    );
}

