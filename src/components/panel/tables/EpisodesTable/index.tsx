"use client";

import { PlayCircle } from "lucide-react";
import { EpisodesTableRow, type EpisodeWithAnime } from "./EpisodesTableRow";

interface EpisodesTableProps {
    items: EpisodeWithAnime[];
    onDelete: (id: string) => void;
}

export function EpisodesTable({ items, onDelete }: EpisodesTableProps) {
    return (
        <div className="bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-2xl overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                    <thead>
                        <tr className="bg-white/5 border-b border-white/5">
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50 w-[30%]">Anime</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Bölüm Bilgisi</th>
                            <th className="h-12 px-4 text-left align-middle font-medium text-white/50">Yayın Tarihi</th>
                            <th className="h-12 px-4 text-right align-middle font-medium text-white/50 w-24"></th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.length === 0 ? (
                            <tr className="border-b border-white/5 hover:bg-transparent">
                                <td colSpan={4} className="p-8 align-middle h-32 text-center text-white/50">
                                    <div className="flex flex-col items-center justify-center gap-2 opacity-50">
                                        <PlayCircle className="w-8 h-8" />
                                        <p>Henüz bölüm bulunamadı.</p>
                                    </div>
                                </td>
                            </tr>
                        ) : (
                            items.map((item) => (
                                <EpisodesTableRow
                                    key={item.id}
                                    item={item}
                                    onDelete={onDelete}
                                />
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
