import { Suspense } from "react";
import { Film } from "lucide-react";
import Container from "@/components/ui/container";
import MoviesListServer from "./MoviesListServer";
import MovieCardSkeleton from "@/components/ui/MovieCard/skeleton";

export const metadata = {
    title: "Filmler - AnimeModu",
    description: "En yeni ve popüler anime filmlerini keşfet.",
};

function MoviesGridSkeleton() {
    return (
        <>
            {Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
            ))}
        </>
    );
}

export default function MoviesPage() {
    return (
        <div className="min-h-screen pt-24 pb-20">
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

                {/* Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 gap-6 sm:gap-8">
                    <Suspense fallback={<MoviesGridSkeleton />}>
                        <MoviesListServer />
                    </Suspense>
                </div>
            </Container>
        </div>
    );
}
