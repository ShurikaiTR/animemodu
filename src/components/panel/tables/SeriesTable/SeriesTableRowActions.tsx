"use client";

import { Sparkles, Edit2, Trash2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface SeriesTableRowActionsProps {
    item: AnimeRow;
    onEdit: (item: AnimeRow) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (item: AnimeRow) => void;
    onUpdateEpisodes?: (id: string) => void;
    isUpdatingEpisodes?: boolean;
}

export function SeriesTableRowActions({
    item,
    onEdit,
    onDelete,
    onToggleFeatured,
    onUpdateEpisodes,
    isUpdatingEpisodes
}: SeriesTableRowActionsProps) {
    return (
        <div className="flex items-center justify-end gap-1">
            {item.media_type === "tv" && onUpdateEpisodes && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onUpdateEpisodes(item.id)}
                    disabled={isUpdatingEpisodes}
                    title="Bölümleri Güncelle"
                    className="h-8 w-8 text-white/40 hover:text-primary hover:bg-white/5 disabled:opacity-50 transition-colors"
                >
                    <RefreshCw className={cn("w-4 h-4", isUpdatingEpisodes && "animate-spin")} />
                </Button>
            )}

            <Button
                size="icon"
                variant="ghost"
                onClick={() => onToggleFeatured(item)}
                title={item.is_featured ? "Öne Çıkarılandan Kaldır" : "Öne Çıkar"}
                className={cn(
                    "h-8 w-8 transition-colors hover:bg-white/5",
                    item.is_featured
                        ? "text-primary hover:text-primary/80"
                        : "text-white/40 hover:text-primary"
                )}
            >
                <Sparkles className={cn("w-4 h-4", item.is_featured && "fill-current")} />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(item)}
                title="Düzenle"
                className="h-8 w-8 text-white/40 hover:text-primary hover:bg-white/5 transition-colors"
            >
                <Edit2 className="w-4 h-4" />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                title="Sil"
                className="h-8 w-8 text-white/40 hover:text-red-500 hover:bg-white/5 transition-colors"
            >
                <Trash2 className="w-4 h-4" />
            </Button>
        </div>
    );
}
