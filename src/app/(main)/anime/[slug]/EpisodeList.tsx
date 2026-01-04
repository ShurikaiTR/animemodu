"use client";

import { MonitorPlay } from "lucide-react";
import { useEffect, useMemo,useRef, useState } from "react";

import EpisodeCard from "@/shared/components/EpisodeCard";
import ScrollButton from "@/shared/components/ScrollButton";
import { getImageUrl } from "@/shared/lib/tmdb";
import { cn, getWatchUrl } from "@/shared/lib/utils";

import type { Episode } from "./types";

interface EpisodeListProps {
    episodes: Episode[];
    structureType: "seasonal" | "absolute";
    animeSlug: string;
    animeBackdrop: string | null;
}

export default function EpisodeList({
    episodes,
    structureType,
    animeSlug,
    animeBackdrop,
}: EpisodeListProps) {
    const episodeListRef = useRef<HTMLDivElement>(null);
    const [selectedSeason, setSelectedSeason] = useState(1);

    // Memoize episode grouping
    const episodesBySeason = useMemo(() => {
        return episodes.reduce(
            (acc, ep) => {
                const season = ep.season_number || 1;
                if (!acc[season]) acc[season] = [];
                acc[season].push(ep);
                return acc;
            },
            {} as Record<number, Episode[]>
        );
    }, [episodes]);

    const seasons = useMemo(
        () => Object.keys(episodesBySeason).map(Number).sort((a, b) => a - b),
        [episodesBySeason]
    );

    useEffect(() => {
        if (seasons.length > 0 && !seasons.includes(selectedSeason)) {
            setSelectedSeason(seasons[0]);
        }
    }, [seasons, selectedSeason]);

    const currentEpisodes =
        structureType === "seasonal"
            ? episodesBySeason[selectedSeason] || []
            : episodes;

    const scrollBy = (direction: "left" | "right") => {
        const amount = direction === "left" ? -80 * 4 : 80 * 4;
        episodeListRef.current?.scrollBy({ left: amount, behavior: "smooth" });
    };

    return (
        <div className="mb-12 relative group/list">
            <div className="flex items-center justify-between mb-6">
                <h3 className="flex items-center gap-3 text-2xl text-white font-rubik font-normal">
                    <MonitorPlay className="w-6 h-6 text-primary" />
                    {structureType === "seasonal" ? `${selectedSeason}. Sezon` : "Bölümler"}
                </h3>

                <div className="flex items-center gap-4">
                    {structureType === "seasonal" && seasons.length > 1 && (
                        <div className="flex gap-2 mr-2">
                            {seasons.map(s => (
                                <button
                                    key={s}
                                    onClick={() => setSelectedSeason(s)}
                                    className={cn(
                                        "px-3 py-1 rounded-lg text-sm font-medium transition-colors",
                                        selectedSeason === s
                                            ? "bg-primary text-white"
                                            : "bg-bg-secondary text-text-main hover:bg-white hover:text-bg-secondary"
                                    )}
                                >
                                    S{s}
                                </button>
                            ))}
                        </div>
                    )}

                    <div className="flex items-center gap-2">
                        <ScrollButton direction="left" onClick={() => scrollBy("left")} />
                        <ScrollButton direction="right" onClick={() => scrollBy("right")} />
                    </div>
                </div>
            </div>

            <div
                ref={episodeListRef}
                className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x scroll-smooth"
            >
                {currentEpisodes.length > 0 ? (
                    currentEpisodes.map(ep => {
                        const isAbsolute = structureType === "absolute";
                        const epNum = isAbsolute ? (ep.absolute_episode_number || ep.episode_number) : ep.episode_number;
                        const seasonNum = isAbsolute ? 1 : ep.season_number;

                        return (
                            <div key={ep.id} className="min-w-64 md:min-w-80 snap-center">
                                <EpisodeCard
                                    title={`${epNum}. Bölüm`}
                                    episodeNumber={epNum.toString()}
                                    image={getImageUrl(ep.still_path || animeBackdrop, "w500")}
                                    timeAgo=""
                                    href={getWatchUrl(animeSlug, epNum, seasonNum, structureType)}
                                />
                            </div>
                        );
                    })
                ) : (
                    <div className="w-full text-center py-8 text-white/40">
                        Bu sezon için henüz bölüm bulunmuyor.
                    </div>
                )}
            </div>
        </div>
    );
}
