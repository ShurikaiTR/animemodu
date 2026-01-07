import { Film, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import { Button } from "@/shared/components/button";
import FavoriteButton from "@/shared/components/FavoriteButton";
import WatchStatusDropdown from "@/shared/components/WatchStatusDropdown";
import { getImageUrl } from "@/shared/lib/tmdb";

interface FeaturedCardProps {
    anime: {
        id: string;
        title: string;
        overview: string | null;
        poster_path: string | null;
        backdrop_path: string | null;
        vote_average: number | null;
        release_date: string | null;
        genres?: string[] | null;
        slug?: string;
    };
}

export default function FeaturedCard({ anime }: FeaturedCardProps) {
    const imageUrl = getImageUrl(anime.backdrop_path || anime.poster_path, "w1280");
    const year = anime.release_date ? parseInt(anime.release_date.split("-")[0]) : 2024;
    const rating = anime.vote_average || 0;
    const genre = (anime.genres && anime.genres.length > 0) ? anime.genres[0] : "Anime";
    const href = anime.slug ? `/anime/${anime.slug}` : "#";

    return (
        <div className="w-full h-96 lg:h-full relative group rounded-3xl overflow-hidden shadow-2xl shadow-black/50 ring-1 ring-white/10 hover:shadow-[0_0_40px_-5px_rgba(var(--primary),0.3)] transition-shadow duration-500">
            {/* Background Image & Gradients (clickable link area) */}
            <Link href={href} className="block w-full h-full absolute inset-0">
                {imageUrl && (
                    <Image
                        src={imageUrl}
                        alt={anime.title}
                        fill
                        sizes="100vw"
                        className="object-cover object-top transition-transform duration-700 group-hover:scale-105 saturate-[1.1]"
                        priority
                    />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gradient-dark via-gradient-dark/50 to-transparent z-10" />
                <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-transparent z-10" />
            </Link>

            {/* Günün Seçimi Badge */}
            <div className="absolute top-6 left-6 z-20 flex items-center gap-2 bg-blue-500/10 text-blue-400 border border-blue-500/20 px-2 py-1 rounded-md text-xs font-medium pointer-events-none">
                Günün Seçimi
            </div>

            {/* Content */}
            <div className="absolute bottom-0 left-0 p-8 sm:p-10 w-full z-20">
                <div className="flex items-center gap-3 mb-6">
                    <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
                        <div className="relative w-10 h-10 flex items-center justify-center">
                            <svg viewBox="0 0 36 36" className="w-full h-full text-primary -rotate-90">
                                <path className="text-primary/20" strokeWidth="3" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                                <path
                                    className="text-current drop-shadow-[0_0_8px_rgba(var(--primary),0.5)]"
                                    strokeDasharray={`${rating * 10}, 100`}
                                    strokeWidth="3"
                                    strokeLinecap="round"
                                    stroke="currentColor"
                                    fill="none"
                                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                                />
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center text-xs font-bold text-white">
                                {rating.toFixed(1)}
                            </div>
                        </div>
                        <span className="text-white/60">•</span>
                        <span className="text-white/70">{year}</span>
                        <span className="text-white/60">•</span>
                        <span className="text-white/70">{genre}</span>
                    </div>
                </div>

                <Link href={href}>
                    <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-white font-rubik mb-4 leading-tight drop-shadow-lg line-clamp-2 hover:text-primary transition-colors cursor-pointer">
                        {anime.title}
                    </h1>
                </Link>

                {anime.overview && (
                    <p className="text-white/70 max-w-xl mb-8 text-sm sm:text-base leading-relaxed hidden sm:block">
                        {anime.overview.length > 180 ? anime.overview.slice(0, 180) + "..." : anime.overview}
                    </p>
                )}

                {/* Interactive buttons - outside of Link */}
                <div className="flex items-center gap-3">
                    <Button size="lg" className="font-bold" asChild>
                        <Link href={href}>
                            <Play className="w-5 h-5 fill-current" /> Hemen İzle
                        </Link>
                    </Button>
                    <Button variant="glass" size="lg">
                        <Film className="w-5 h-5" /> Fragman
                    </Button>
                    <div className="h-10">
                        <WatchStatusDropdown animeId={anime.id} variant="featured" />
                    </div>
                    <FavoriteButton animeId={anime.id} variant="featured" />
                </div>
            </div>
        </div>
    );
}
