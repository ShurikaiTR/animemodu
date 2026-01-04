"use client";

import { Calendar,Sparkles, Star } from "lucide-react";

import { Badge } from "@/shared/components/badge";
import type { Database } from "@/shared/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface SeriesTableRowRatingProps {
    item: AnimeRow;
}

export function SeriesTableRowRating({ item }: SeriesTableRowRatingProps) {
    return (
        <div className="flex flex-col gap-1">
            {item.vote_average !== null ? (
                <div className="flex items-center gap-1.5 text-sm font-bold text-yellow-500">
                    <Star className="w-3.5 h-3.5 fill-current" />
                    {item.vote_average.toFixed(1)}
                </div>
            ) : (
                <span className="text-text-main/30">-</span>
            )}
            <div className="flex items-center gap-1.5 text-xs text-text-main/50">
                <Calendar className="w-3 h-3 opacity-70" />
                {item.release_date ? item.release_date.substring(0, 4) : "-"}
            </div>
        </div>
    );
}

interface SeriesTableRowStatusProps {
    item: AnimeRow;
}

export function SeriesTableRowStatus({ item }: SeriesTableRowStatusProps) {
    return (
        <div className="flex items-center gap-2">
            {item.is_featured ? (
                <Badge variant="default" className="bg-primary/20 text-primary hover:bg-primary/30 border-primary/20 gap-1">
                    <Sparkles className="w-3 h-3 fill-current" />
                    Öne Çıkan
                </Badge>
            ) : (
                <span className="text-xs text-text-main/40 font-medium px-2">Standart</span>
            )}
        </div>
    );
}
