"use client";

import Link from "next/link";
import Image from "next/image";
import { Play } from "lucide-react";
import { cn, getWatchUrl } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import type { EpisodeListItem } from "@/types/domain/anime";

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
                        alt={`Bölüm ${episode.episode_number}`}
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
                        <div className="bg-primary text-white text-xs font-bold px-2 py-0.5 rounded shadow-lg animate-pulse">
                            OYNATILIYOR
                        </div>
                    </div>
                )}
                <div className="absolute bottom-1 right-1 bg-black/60 px-1 py-0.5 rounded text-xs font-mono text-white/80">
                    {episode.runtime ? `${episode.runtime}dk` : "24dk"}
                </div>
            </div>

            <div className="flex-1 min-w-0 flex flex-col justify-center">
                <div className="flex items-center gap-2 mb-0.5">
                    <span className={cn(
                        "text-xs font-bold uppercase tracking-wider",
                        isCurrent ? "text-primary" : "text-white/40 group-hover:text-primary transition-colors"
                    )}>
                        {structureType === "seasonal" ? `${episode.season_number}x${episode.episode_number}` : `Bölüm ${epNum}`}
                    </span>
                </div>
                <h4 className={cn(
                    "font-bold text-sm line-clamp-1 transition-colors",
                    isCurrent ? "text-primary" : "text-white group-hover:text-white"
                )}>
                    {`${episode.episode_number}. Bölüm`}
                </h4>
                <p className="text-white/40 text-xs line-clamp-1 mt-0.5">
                    {episode.overview || "Özet yok."}
                </p>
            </div>

            <div className="flex items-center px-1">
                {!isCurrent && (
                    <Button size="icon" variant="ghost" className="rounded-full w-8 h-8 opacity-0 group-hover:opacity-100 transition-opacity hover:bg-primary hover:text-white">
                        <Play className="w-3 h-3 fill-current" />
                    </Button>
                )}
            </div>
        </>
    );

    const cardClasses = cn(
        "group flex gap-3 p-2 rounded-xl border transition-all relative",
        isCurrent
            ? "bg-primary/10 border-primary/50"
            : "bg-bg-secondary/30 border-white/5 hover:bg-white/5 hover:border-white/10"
    );

    if (isCurrent) {
        return (
            <div className={cardClasses}>
                <Content />
            </div>
        );
    }

    return (
        <Link href={watchUrl} className={cardClasses}>
            <Content />
        </Link>
    );
}















