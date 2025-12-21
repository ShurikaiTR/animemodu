"use client";

import { useRef } from "react";
import { MonitorPlay, ChevronLeft, ChevronRight } from "lucide-react";
import { cn, getWatchUrl } from "@/lib/utils";
import EpisodeCard from "@/components/ui/EpisodeCard";
import { getImageUrl } from "@/lib/tmdb";
import type { Episode, AnimeDetailData } from "./types";

interface EpisodeListSectionProps {
  episodes: Episode[];
  selectedSeason: number;
  seasons: number[];
  structureType: "seasonal" | "absolute";
  anime: AnimeDetailData;
  onSeasonChange: (season: number) => void;
}

export default function EpisodeListSection({
  episodes,
  selectedSeason,
  seasons,
  structureType,
  anime,
  onSeasonChange,
}: EpisodeListSectionProps) {
  const episodeListRef = useRef<HTMLDivElement>(null);

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
                  onClick={() => onSeasonChange(s)}
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
            <button
              onClick={() => episodeListRef.current?.scrollBy({ left: -80 * 4, behavior: "smooth" })}
              className="w-10 h-10 rounded-full bg-bg-secondary border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all active:scale-95"
              aria-label="Önceki"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => episodeListRef.current?.scrollBy({ left: 80 * 4, behavior: "smooth" })}
              className="w-10 h-10 rounded-full bg-bg-secondary border border-white/5 flex items-center justify-center text-white hover:bg-primary hover:text-white transition-all active:scale-95"
              aria-label="Sonraki"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>

      <div
        ref={episodeListRef}
        className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 custom-scrollbar snap-x scroll-smooth"
      >
        {episodes.length > 0 ? (
          episodes.map(ep => (
            <div key={ep.id} className="min-w-64 md:min-w-80 snap-center">
              <EpisodeCard
                title={ep.title || `${ep.episode_number}. Bölüm`}
                episodeNumber={ep.episode_number.toString()}
                image={getImageUrl(ep.still_path || anime.backdrop_path, "w500")}
                timeAgo=""
                href={getWatchUrl(anime.slug || "", ep.episode_number, ep.season_number, structureType)}
              />
            </div>
          ))
        ) : (
          <div className="w-full text-center py-8 text-white/40">
            Bu sezon için henüz bölüm bulunmuyor.
          </div>
        )}
      </div>
    </div>
  );
}
