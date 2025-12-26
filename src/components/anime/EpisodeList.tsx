"use client";

import { useState } from "react";
import { Play } from "lucide-react";
import { cn } from "@/lib/utils";
import SeasonTabs from "./EpisodeList/SeasonTabs";
import EpisodeCard from "./EpisodeList/EpisodeCard";
import type { EpisodeListItem } from "@/types/domain/anime";

interface EpisodeListProps {
    episodes: EpisodeListItem[];
    structureType: "seasonal" | "absolute";
    animeId: string;
    animeSlug: string;
    layoutMode?: "grid" | "list";
    currentEpisodeId?: number | string;
    currentEpisodeNumber?: number;
    currentSeasonNumber?: number;
    hideHeader?: boolean;
}


export default function EpisodeList({ episodes, structureType, animeId, animeSlug, layoutMode = "grid", currentEpisodeId, currentEpisodeNumber, currentSeasonNumber, hideHeader = false }: EpisodeListProps) {
    const seasons = Array.from(new Set(episodes.map(e => e.season_number))).sort((a, b) => a - b);
    const [activeSeason, setActiveSeason] = useState(seasons[0] || 1);

    const displayedEpisodes = structureType === "seasonal"
        ? episodes.filter(e => e.season_number === activeSeason).sort((a, b) => a.episode_number - b.episode_number)
        : episodes.sort((a, b) => (a.episode_number) - (b.episode_number));

    if (episodes.length === 0) {
        return (
            <div className="text-center py-10 border border-dashed border-white/10 rounded-xl">
                <p className="text-white/40">Henüz bölüm eklenmemiş.</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {!hideHeader && (
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                    <Play className="w-5 h-5 text-primary" />
                    Bölümler
                </h3>
            )}

            {structureType === "seasonal" && (
                <SeasonTabs
                    seasons={seasons}
                    activeSeason={activeSeason}
                    onSeasonChange={setActiveSeason}
                />
            )}

            <div className={cn(
                "grid gap-4",
                layoutMode === "grid" ? "grid-cols-1 md:grid-cols-2" : "grid-cols-1"
            )}>
                {displayedEpisodes.map(episode => {
                    const isCurrent = Boolean(
                        currentEpisodeId && (episode.id === currentEpisodeId || episode.id == currentEpisodeId)
                    ) || Boolean(
                        currentEpisodeNumber !== undefined &&
                        currentSeasonNumber !== undefined &&
                        episode.episode_number === currentEpisodeNumber &&
                        episode.season_number === currentSeasonNumber
                    );
                    return (
                        <EpisodeCard
                            key={episode.id}
                            episode={episode}
                            structureType={structureType}
                            animeId={animeId}
                            animeSlug={animeSlug}
                            isCurrent={isCurrent}
                        />
                    );
                })}
            </div>
        </div>
    );
}
