"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn, getWatchUrl } from "@/shared/lib/utils";
import type { EpisodeListItem } from "@/shared/types/domain/anime";

interface EpisodeCardProps {
    episode: EpisodeListItem;
    structureType: "seasonal" | "absolute";
    animeId: string;
    animeSlug: string;
    isCurrent: boolean;
}

export default function EpisodeCard({ episode, structureType, animeSlug, isCurrent }: EpisodeCardProps) {
    // Absolute modda: episode_number yerine absolute_episode_number kullan
    const isAbsolute = structureType === "absolute";
    const epNum = isAbsolute ? (episode.absolute_episode_number || episode.episode_number) : episode.episode_number;
    const seasonNum = isAbsolute ? 1 : episode.season_number;
    const watchUrl = getWatchUrl(animeSlug, epNum, seasonNum, structureType);

    const Content = () => (
        <>
            <div className="relative w-28 aspect-video shrink-0 rounded-lg overflow-hidden bg-black/50">
                {episode.still_path ? (
                    <Image
                        src={episode.still_path.startsWith("http") ? episode.still_path : `https://image.tmdb.org/t/p/w300${episode.still_path}`}
                        alt={`${episode.episode_number}. Bölüm kapağı`}
                        fill
                        sizes="(max-width: 768px) 100vw, 300px"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-white/20">
                        <Play className="w-6 h-6" />
                    </div>
                )}
                {isCurrent && (
                    <div className="absolute inset-0 bg-primary/20 flex items-center justify-center">
                        <div className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-pulse">
                            OYNATILIYOR
                        </div>
                    </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-[10px] font-mono text-white/80">
                    {episode.runtime ? `${episode.runtime}dk` : "24dk"}
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                        "text-[10px] font-bold uppercase tracking-wider",
                        isCurrent ? "text-primary" : "text-white/40 group-hover:text-primary transition-colors"
                    )}>
                        {structureType === "seasonal" ? `${episode.season_number}x${episode.episode_number}` : `Bölüm ${epNum}`}
                    </span>
                </div>
                <h3 className={cn(
                    "font-bold text-sm line-clamp-1 transition-colors",
                    isCurrent ? "text-primary" : "text-white group-hover:text-white"
                )}>
                    {`${episode.episode_number}. Bölüm`}
                </h3>
                <p className="text-white/40 text-[11px] line-clamp-1 mt-0.5">
                    {episode.overview || "Özet yok."}
                </p>
            </div>

            <div className="flex items-center px-1">
                {!isCurrent && (
                    <div className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center bg-primary text-white">
                        <Play className="w-3 h-3 fill-current" />
                    </div>
                )}
            </div>
        </>
    );

    const cardClasses = cn(
        "group flex gap-3 p-2 rounded-xl border transition-all relative outline-none focus-visible:ring-1 focus-visible:ring-primary",
        isCurrent
            ? "bg-primary/10 border-primary/50"
            : "bg-bg-secondary/30 border-white/5 hover:bg-white/5 hover:border-white/10"
    );

    if (isCurrent) {
        return (
            <div className={cardClasses} aria-current="true">
                <Content />
            </div>
        );
    }

    return (
        <Link
            href={watchUrl}
            className={cardClasses}
            aria-label={`${episode.episode_number}. Bölümü İzle`}
        >
            <Content />
        </Link>
    );
}















