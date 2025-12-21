"use client";

import type { Database } from "@/types/supabase";
import Image from "next/image";
import { getImageUrl } from "@/lib/tmdb";
import { Sparkles, Star, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { CatalogItemActions } from "./CatalogItemActions";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface CatalogItemProps {
    item: AnimeRow;
    onEdit: (item: AnimeRow) => void;
    onDelete: (id: number) => void;
    onToggleFeatured: (item: AnimeRow) => void;
    onUpdateEpisodes?: (id: number) => void;
    isUpdatingEpisodes?: boolean;
}

export function CatalogItem({ item, onEdit, onDelete, onToggleFeatured, onUpdateEpisodes, isUpdatingEpisodes }: CatalogItemProps) {
    return (
        <div className={cn(
            "group relative bg-bg-secondary/30 backdrop-blur-sm border rounded-xl p-4 flex gap-5 transition-all duration-200",
            item.is_featured ? "border-primary/40 bg-primary/5 hover:border-primary/60" : "border-white/5 hover:border-white/10 hover:bg-white/[0.03]"
        )}>
            <div className="relative w-[80px] h-[120px] shrink-0 rounded-lg overflow-hidden shadow-lg bg-black/50 border border-white/5">
                {item.poster_path ? (
                    <Image
                        src={getImageUrl(item.poster_path, "w200")}
                        alt={item.title}
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Sparkles className="w-6 h-6" />
                    </div>
                )}
                {item.is_featured && (
                    <div className="absolute top-1 right-1 bg-primary text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg backdrop-blur-md flex items-center gap-0.5">
                        <Sparkles className="w-2 h-2 fill-current" />
                        ÖNE ÇIKAN
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-base font-bold text-white font-rubik truncate pr-2">
                        {item.title}
                    </h3>

                    <div className="flex items-center gap-2">
                        {item.structure_type && (
                            <Badge variant="teal">
                                {item.structure_type === 'seasonal' ? 'Sezonlu' : 'Sezonsuz'}
                            </Badge>
                        )}
                        <Badge variant={item.media_type === "movie" ? "purple" : "default"}>
                            {item.media_type === 'movie' ? 'Film' : 'Dizi'}
                        </Badge>
                    </div>
                </div>

                {item.original_title && (
                    <div className="text-xs text-text-main/40 mb-2 font-mono truncate">
                        {item.original_title}
                    </div>
                )}

                {item.genres && item.genres.length > 0 ? (
                    <div className="flex flex-wrap gap-1 mb-auto">
                        {item.genres.slice(0, 3).map((g: string, i: number) => (
                            <Badge key={i} variant="default">
                                {g}
                            </Badge>
                        ))}
                        {item.genres.length > 3 && (
                            <span className="text-[10px] text-text-main/40 px-1.5 py-0.5">+</span>
                        )}
                    </div>
                ) : (
                    <div className="mb-auto"></div>
                )}

                <div className="flex items-center gap-4 mt-3 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-main/50">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        {item.release_date ? item.release_date.substring(0, 4) : "-"}
                    </div>

                    {item.vote_average !== null && (
                        <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
                            <Star className="w-3.5 h-3.5 fill-current" />
                            {item.vote_average.toFixed(1)}
                        </div>
                    )}

                    <CatalogItemActions
                        item={item}
                        isUpdatingEpisodes={isUpdatingEpisodes}
                        onEdit={onEdit}
                        onDelete={onDelete}
                        onToggleFeatured={onToggleFeatured}
                        onUpdateEpisodes={onUpdateEpisodes}
                    />
                </div>
            </div>
        </div>
    );
}
