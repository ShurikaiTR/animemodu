"use client";

import { cn } from "@/lib/utils";

interface SeasonTabsProps {
    seasons: number[];
    activeSeason: number;
    onSeasonChange: (season: number) => void;
}

export default function SeasonTabs({ seasons, activeSeason, onSeasonChange }: SeasonTabsProps) {
    if (seasons.length === 0) return null;

    return (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 custom-scrollbar">
            {seasons.map(season => (
                <button
                    key={season}
                    onClick={() => onSeasonChange(season)}
                    className={cn(
                        "px-4 py-2 rounded-lg text-sm font-bold transition-all whitespace-nowrap",
                        activeSeason === season
                            ? "bg-primary text-white shadow-lg shadow-primary/20"
                            : "bg-white/5 text-white/50 hover:bg-white/10 hover:text-white"
                    )}
                >
                    {season === 0 ? "Özel Bölümler" : `${season}. Sezon`}
                </button>
            ))}
        </div>
    );
}















