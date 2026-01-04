"use client";

import { Sparkles } from "lucide-react";
import Image from "next/image";

import { Badge } from "@/shared/components/badge";
import { getImageUrl } from "@/shared/lib/tmdb";
import type { Database } from "@/shared/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface SeriesTableRowContentProps {
    item: AnimeRow;
}

export function SeriesTableRowContent({ item }: SeriesTableRowContentProps) {
    return (
        <div className="flex items-center gap-4">
            <div className="relative w-12 h-16 shrink-0 rounded-md overflow-hidden bg-black/50 border border-white/5">
                {item.poster_path ? (
                    <Image
                        src={getImageUrl(item.poster_path, "w200")}
                        alt={item.title}
                        fill
                        sizes="48px"
                        className="object-cover"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Sparkles className="w-4 h-4" />
                    </div>
                )}
            </div>
            <div>
                <div className="font-medium text-white mb-1 line-clamp-1">{item.title}</div>
                {item.original_title && (
                    <div className="text-xs text-text-main/50 font-mono line-clamp-1 mb-1">
                        {item.original_title}
                    </div>
                )}
                <div className="flex items-center gap-2">
                    <Badge variant={item.media_type === "movie" ? "purple" : "default"} className="text-[0.625rem] px-1.5 py-0 h-5">
                        {item.media_type === 'movie' ? 'Film' : 'Dizi'}
                    </Badge>
                    {item.genres && item.genres.length > 0 && (
                        <span className="text-xs text-text-main/40 truncate max-w-36">
                            {item.genres.slice(0, 2).join(", ")}
                        </span>
                    )}
                </div>
            </div>
        </div>
    );
}
