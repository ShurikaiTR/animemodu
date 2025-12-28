"use client";

import Image from "next/image";
import Link from "next/link";
import { getImageUrl } from "@/shared/lib/tmdb";
import { Calendar, PlayCircle, Edit2, Trash2 } from "lucide-react";
import { Button } from "@/shared/components/button";
import type { Database } from "@/shared/types/supabase";

// Defining a joined type for Episode with Anime
type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];
type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

export interface EpisodeWithAnime extends EpisodeRow {
    animes: Pick<AnimeRow, "id" | "title" | "slug" | "poster_path" | "structure_type"> | null;
}

interface EpisodesTableRowProps {
    item: EpisodeWithAnime;
    onDelete: (id: string) => void;
}

export function EpisodesTableRow({ item, onDelete }: EpisodesTableRowProps) {
    const isAbsolute = item.animes?.structure_type === "absolute";

    return (
        <tr className="border-b border-white/5 hover:bg-white/5 transition-colors group">
            {/* Anime Info */}
            <td className="p-4 align-middle">
                <div className="flex items-center gap-4">
                    <div className="relative w-10 h-14 shrink-0 rounded-md overflow-hidden bg-black/50 border border-white/5">
                        {item.animes?.poster_path ? (
                            <Image
                                src={getImageUrl(item.animes.poster_path, "w200")}
                                alt={item.animes.title || ""}
                                fill
                                sizes="40px"
                                className="object-cover"
                            />
                        ) : (
                            <div className="w-full h-full flex items-center justify-center text-white/10">
                                <PlayCircle className="w-4 h-4" />
                            </div>
                        )}
                    </div>
                    <div>
                        <div className="font-medium text-white mb-0.5 line-clamp-1">
                            {item.animes?.title || "Bilinmeyen Anime"}
                        </div>
                    </div>
                </div>
            </td>

            {/* Episode Info */}
            <td className="p-4 align-middle">
                <div className="flex flex-col">
                    <span className="text-sm font-medium text-white">
                        {isAbsolute
                            ? `${item.episode_number}. Bölüm`
                            : `${item.season_number}. Sezon, ${item.episode_number}. Bölüm`
                        }
                    </span>
                    {isAbsolute && (
                        <span className="text-[10px] text-text-main/40 uppercase tracking-widest mt-0.5">
                            Tek Liste
                        </span>
                    )}
                </div>
            </td>

            {/* Date */}
            <td className="p-4 align-middle">
                <div className="flex items-center gap-1.5 text-xs text-text-main/50">
                    <Calendar className="w-3 h-3 opacity-70" />
                    {item.air_date ? new Date(item.air_date).toLocaleDateString('tr-TR') : "-"}
                </div>
            </td>

            <td className="p-4 align-middle text-right">
                <div className="flex items-center justify-end gap-1">
                    <Link href={`/panel/episodes/${item.animes?.slug}/${item.id}`}>
                        <Button
                            size="icon"
                            variant="ghost"
                            title="Bölümü Düzenle"
                            className="h-8 w-8 text-white/40 transition-colors hover:bg-white/5 hover:text-primary"
                        >
                            <Edit2 className="w-4 h-4" />
                        </Button>
                    </Link>
                    <Button
                        size="icon"
                        variant="ghost"
                        onClick={() => onDelete(item.id)}
                        title="Bölümü Sil"
                        className="h-8 w-8 text-white/40 transition-colors hover:bg-white/5 hover:text-red-500"
                    >
                        <Trash2 className="w-4 h-4" />
                    </Button>
                </div>
            </td>
        </tr>
    );
}
