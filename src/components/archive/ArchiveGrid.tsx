"use client";

import MovieCard from "@/components/ui/MovieCard";
import { getImageUrl } from "@/lib/tmdb";
import type { AnimeRow } from "@/types/helpers";

interface ArchiveGridProps {
    animes: AnimeRow[];
}

export default function ArchiveGrid({ animes }: ArchiveGridProps) {
    if (!animes || animes.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center py-20 text-text-main/40">
                <p className="text-lg">Henüz hiç içerik eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-y-8 gap-x-5 animate-in fade-in slide-in-from-bottom-5 duration-700 delay-200">
            {animes.map((anime) => {
                const year = anime.release_date
                    ? parseInt(anime.release_date.split("-")[0])
                    : new Date().getFullYear();

                return (
                    <MovieCard
                        key={anime.id}
                        title={anime.title}
                        year={year}
                        genres={anime.genres}
                        rating={anime.vote_average || 0}
                        image={getImageUrl(anime.poster_path, "w500")}
                        className="hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300"
                        slug={anime.slug}
                    />
                );
            })}
        </div>
    );
}
