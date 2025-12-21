
"use client";

import { Edit2, Trash2, RefreshCw, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Database } from "@/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface CatalogItemActionsProps {
    item: AnimeRow;
    isUpdatingEpisodes?: boolean;
    onEdit: (item: AnimeRow) => void;
    onDelete: (id: number) => void;
    onToggleFeatured: (item: AnimeRow) => void;
    onUpdateEpisodes?: (id: number) => void;
}

export function CatalogItemActions({
    item,
    isUpdatingEpisodes,
    onEdit,
    onDelete,
    onToggleFeatured,
    onUpdateEpisodes
}: CatalogItemActionsProps) {
    return (
        <div className="ml-auto flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
            {item.media_type === "tv" && onUpdateEpisodes && (
                <Button
                    size="icon"
                    variant="ghost"
                    onClick={() => onUpdateEpisodes(item.id)}
                    disabled={isUpdatingEpisodes}
                    title="Yeni bölümleri güncelle"
                    className="h-7 w-7 rounded-lg text-text-main hover:text-primary hover:bg-primary/10 disabled:opacity-50"
                >
                    <RefreshCw className={cn("w-3.5 h-3.5", isUpdatingEpisodes && "animate-spin")} />
                </Button>
            )}
            <Button
                size="icon"
                variant="ghost"
                onClick={() => onToggleFeatured(item)}
                title={item.is_featured ? "Öne Çıkarılandan Kaldır" : "Öne Çıkar"}
                className={cn(
                    "h-7 w-7 rounded-lg transition-colors",
                    item.is_featured
                        ? "text-primary bg-primary/10 hover:bg-primary/20 hover:text-primary"
                        : "text-text-main hover:text-primary hover:bg-primary/10"
                )}
            >
                <Sparkles className={cn("w-3.5 h-3.5", item.is_featured && "fill-current")} />
            </Button>

            <Button
                size="icon"
                variant="ghost"
                onClick={() => onEdit(item)}
                className="h-7 w-7 rounded-lg text-text-main hover:text-white hover:bg-white/10"
            >
                <Edit2 className="w-3.5 h-3.5" />
            </Button>
            <Button
                size="icon"
                variant="ghost"
                onClick={() => onDelete(item.id)}
                className="h-7 w-7 rounded-lg text-red-500/70 hover:text-red-400 hover:bg-red-500/10"
            >
                <Trash2 className="w-3.5 h-3.5" />
            </Button>
        </div>
    );
}
