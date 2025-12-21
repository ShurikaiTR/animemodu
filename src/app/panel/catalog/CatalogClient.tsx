"use client";

import { useState } from "react";
import { CatalogItem } from "@/components/panel/tables/CatalogItem";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Plus } from "lucide-react";
import Link from "next/link";
import type { AnimeRow } from "../types";
import { DeleteAnimeConfirmationModal } from "@/components/panel/tables/CatalogItem/DeleteAnimeConfirmationModal";
import { useCatalogActions } from "./useCatalogActions";

interface CatalogClientProps {
    initialAnimes: AnimeRow[];
}

export default function CatalogClient({ initialAnimes }: CatalogClientProps) {
    const [animes, setAnimes] = useState<AnimeRow[]>(initialAnimes);
    const [searchQuery, setSearchQuery] = useState("");

    const {
        deleteAnimeId,
        setDeleteAnimeId,
        updatingAnimeId,
        isPending,
        handleDelete,
        handleEdit,
        handleToggleFeatured,
        handleUpdateEpisodes,
    } = useCatalogActions({ onAnimesChange: setAnimes });

    const filteredAnimes = animes.filter(
        (anime) =>
            anime.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
            anime.original_title?.toLowerCase().includes(searchQuery.toLowerCase())
    );


    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">İçerik Kataloğu</h2>
                        <p className="text-text-main/60 text-sm">Veritabanındaki tüm anime, film ve dizileri yönetin.</p>
                    </div>
                    <Link href="/panel/add">
                        <Button className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 gap-2">
                            <Plus className="w-4 h-4" />
                            Yeni Ekle
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="relative group w-full">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-text-main/40 group-focus-within:text-primary transition-colors" />
                    <Input
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Katalogda ara..."
                        className="h-14 pl-12 bg-bg-secondary/30 border-none text-white placeholder:text-text-main/30 text-base focus:bg-bg-secondary/50 rounded-xl transition-all shadow-sm focus-visible:ring-0"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {filteredAnimes.length > 0 ? (
                    filteredAnimes.map((anime) => (
                        <CatalogItem
                            key={anime.id}
                            item={anime}
                            onDelete={() => setDeleteAnimeId(anime.id)}
                            onEdit={handleEdit}
                            onToggleFeatured={handleToggleFeatured}
                            onUpdateEpisodes={handleUpdateEpisodes}
                            isUpdatingEpisodes={updatingAnimeId === anime.id}
                        />
                    ))
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

            <DeleteAnimeConfirmationModal
                isOpen={!!deleteAnimeId}
                onClose={() => setDeleteAnimeId(null)}
                onConfirm={handleDelete}
                isPending={isPending}
                animeTitle={animes.find(anime => anime.id === deleteAnimeId)?.title || null}
            />
        </div>
    );
}

