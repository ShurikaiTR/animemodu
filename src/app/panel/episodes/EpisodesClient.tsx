"use client";

import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { EpisodesTable } from "@/components/panel/tables/EpisodesTable";
import type { EpisodeWithAnime } from "@/components/panel/tables/EpisodesTable/EpisodesTableRow";
import { deleteEpisode } from "@/features/anime/actions";
import { DeleteConfirmationModal } from "@/shared/components/DeleteConfirmationModal";
import EmptyState from "@/shared/components/EmptyState";
import { Input } from "@/shared/components/input";
import { Pagination } from "@/shared/components/Pagination";

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
    const [deleteEpisodeId, setDeleteEpisodeId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleDelete = () => {
        if (!deleteEpisodeId) return;

        startTransition(async () => {
            const result = await deleteEpisode(deleteEpisodeId);
            if (result.success) {
                toast.success("Bölüm başarıyla silindi.");
                setDeleteEpisodeId(null);
                router.refresh();
            } else {
                toast.error(result.error);
            }
        });
    };

    const selectedEpisode = initialEpisodes.find(e => e.id === deleteEpisodeId);
    const episodeTitle = selectedEpisode
        ? `${selectedEpisode.animes?.title || "Bilinmeyen Anime"} - ${selectedEpisode.season_number}. Sezon ${selectedEpisode.episode_number}. Bölüm`
        : null;

    // Client-side filtering only affects the current page's items
    const filteredEpisodes = initialEpisodes.filter((episode) => {
        const animeTitle = episode.animes?.title?.toLowerCase() || "";
        const query = searchQuery.toLowerCase();
        return animeTitle.includes(query);
    });

    return (
        <div className="space-y-6 pb-20 animate-in fade-in duration-500">
            <div className="pb-6 border-b border-white/5 flex flex-col gap-6">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">Bölümler</h2>
                        <p className="text-sm text-text-main/60">
                            Tüm içeriklere ait bölümleri buradan görüntüleyebilirsiniz.
                        </p>
                    </div>
                </div>
            </div>

            <div className="relative group w-full">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-text-main/40 transition-colors group-focus-within:text-primary" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Bu sayfada ara..."
                        className="h-14 pl-12 text-white text-base placeholder:text-text-main/30 bg-bg-secondary/30 border-none rounded-xl shadow-sm transition-all focus:bg-bg-secondary/50 focus-visible:ring-0"
                    />
                </div>
            </div>

            <div className="mt-6 space-y-6">
                {filteredEpisodes.length > 0 ? (
                    <>
                        <EpisodesTable
                            items={filteredEpisodes}
                            onDelete={(id: string) => setDeleteEpisodeId(id)}
                        />
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
                    <EmptyState
                        icon={Search}
                        title="Kayıt bulunamadı."
                        description={searchQuery ? "Arama kriterlerini değiştirmeyi deneyin." : undefined}
                    />
                )}
            </div>

            <DeleteConfirmationModal
                isOpen={!!deleteEpisodeId}
                onClose={() => setDeleteEpisodeId(null)}
                onConfirm={handleDelete}
                isPending={isPending}
                entityType="episode"
                entityName={episodeTitle}
            />
        </div>
    );
}
