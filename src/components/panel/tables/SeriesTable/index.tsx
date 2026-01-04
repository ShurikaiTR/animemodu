"use client";

import { Tv } from "lucide-react";

import type { Database } from "@/shared/types/supabase";

import { SeriesTableRow } from "./SeriesTableRow";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface SeriesTableProps {
    items: AnimeRow[];
    onEdit: (item: AnimeRow) => void;
    onDelete: (id: string) => void;
    onToggleFeatured: (item: AnimeRow) => void;
    onUpdateEpisodes: (id: string) => void;
    updatingAnimeId: string | null;
}

export function SeriesTable({
    items,
    onEdit,
    onDelete,
    onToggleFeatured,
    onUpdateEpisodes,
    updatingAnimeId
}: SeriesTableProps) {
    return (
        <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            {/* Header removed as it is usually handled in the parent page or client component */}
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-[40%]">İçerik</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Puan & Yıl</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Durum</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-white/50 w-20"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr className="border-b border-white/5 hover:bg-transparent">
                                <td colSpan={4} className="p-8 align-middle h-32 text-center text-white/50">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                                        <Tv className="w-8 h-8" />
                                        <p>Henüz içerik bulunamadı.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <SeriesTableRow
                                    key={item.id}
                                    item={item}
                                    onEdit={onEdit}
                                    onDelete={onDelete}
                                    onToggleFeatured={onToggleFeatured}
                                    onUpdateEpisodes={onUpdateEpisodes}
                                    isUpdatingEpisodes={updatingAnimeId === item.id}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
