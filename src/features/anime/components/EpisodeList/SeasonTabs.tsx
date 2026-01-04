"use client";

import { cn } from "@/shared/lib/utils";
import { Layers } from "lucide-react";

interface SeasonTabsProps {
    seasons: number[];
    activeSeason: number;
    onSeasonChange: (season: number) => void;
}

export default function SeasonTabs({ seasons, activeSeason, onSeasonChange }: SeasonTabsProps) {
    if (seasons.length === 0) return null;

    // If only one season, don't show tabs
    if (seasons.length === 1) return null;

    return (
        <nav className="flex items-center gap-2 mb-4" aria-label="Sezon seçimi">
            <span className="text-xs font-semibold text-white/40 uppercase tracking-wider flex items-center gap-1.5 shrink-0">
                <Layers className="w-3.5 h-3.5" />
                Sezon
            </span>
            <div className="flex items-center gap-1.5 flex-wrap">
                {seasons.map(season => (
                    <button
                        key={season}
                        onClick={() => onSeasonChange(season)}
                        aria-label={`${season === 0 ? "Özel Bölümler" : `${season}. Sezon`}`}
                        title={season === 0 ? "Özel Bölümler" : `${season}. Sezon`}
                        className={cn(
                            "w-11 h-11 rounded-lg text-sm font-bold transition-all flex items-center justify-center outline-none focus-visible:ring-2 focus-visible:ring-primary",
                            activeSeason === season
                                ? "bg-primary text-white shadow-lg shadow-primary/20"
                                : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white border border-white/5 hover:border-white/10"
                        )}
                    >
                        {season === 0 ? "Ö" : season}
                    </button>
                ))}
            </div>
        </nav>
    );
}
