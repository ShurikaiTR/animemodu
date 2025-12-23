"use client";

import { useState } from "react";
import { EpisodesTable } from "@/components/panel/tables/EpisodesTable";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";
import type { EpisodeWithAnime } from "@/components/panel/tables/EpisodesTable/EpisodesTableRow";

import { Pagination } from "@/components/panel/Pagination";

interface EpisodesClientProps {
    initialEpisodes: EpisodeWithAnime[];
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

export default function EpisodesClient({
    initialEpisodes,
    totalItems,
    itemsPerPage,
    currentPage
}: EpisodesClientProps) {
    const [searchQuery, setSearchQuery] = useState("");

    // Client-side filtering only affects the current page's items
    const filteredEpisodes = initialEpisodes.filter((episode) => {
        const animeTitle = episode.animes?.title?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return animeTitle.includes(query);
    });

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">Bölümler</h2>
                        <p className="text-text-main/60 text-sm">
                            Tüm içeriklere ait bölümleri buradan görüntüleyebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative group w-full">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-text-main/40 group-focus-within:text-primary transition-colors" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Bu sayfada ara..."
                        className="h-14 pl-12 bg-bg-secondary/30 border-none text-white placeholder:text-text-main/30 text-base focus:bg-bg-secondary/50 rounded-xl transition-all shadow-sm focus-visible:ring-0"
                    />
                </div>
            </div>

            <div className="mt-6 space-y-6">
                {filteredEpisodes.length > 0 ? (
                    <>
                        <EpisodesTable items={filteredEpisodes} />
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                            <p className="text-text-main/50 text-sm">
                                Toplam {totalItems} sonuçtan {(currentPage - 1) * itemsPerPage + 1}-{Math.min(currentPage * itemsPerPage, totalItems)} gösteriliyor
                            </p>
                            <Pagination
                                totalItems={totalItems}
                                itemsPerPage={itemsPerPage}
                                currentPage={currentPage}
                            />
                        </div>
                    </>
                ) : (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-text-main/20 border border-dashed border-white/5 rounded-2xl bg-bg-secondary/10">
                        <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mb-4">
                            <Search className="w-8 h-8 opacity-40" />
                        </div>
                        <p className="text-base font-medium">Kayıt bulunamadı.</p>
                        {searchQuery && <p className="text-sm mt-1">Arama kriterlerini değiştirmeyi deneyin.</p>}
                    </div>
                )}
            </div>
        </div>
    );
}
