"use client";

import { Heart, Library } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateWatchStatus } from "@/features/profile/actions/list-actions";
import { toggleFavorite } from "@/features/profile/actions/list-actions";
import EmptyState from "@/shared/components/EmptyState";
import MovieCard from "@/shared/components/MovieCard";
import type { FavoriteItem, WatchListItem } from "@/shared/types/helpers";

import DesktopTabs from "./DesktopTabs";
import MobileTabDropdown from "./MobileTabDropdown";

const TABS = [
    { id: "all", label: "Tümü" },
    { id: "watching", label: "İzliyorum" },
    { id: "completed", label: "İzledim" },
    { id: "plan_to_watch", label: "İzleyeceğim" },
    { id: "on_hold", label: "Beklemede" },
    { id: "dropped", label: "Bıraktım" },
    { id: "favorites", label: "Favoriler" },
];

interface WatchListTabsProps {
    initialItems: WatchListItem[];
    favorites: FavoriteItem[];
}

export default function WatchListTabs({ initialItems, favorites: initialFavorites }: WatchListTabsProps) {
    const [items, setItems] = useState(initialItems);
    const [favorites, setFavorites] = useState(initialFavorites);
    const [activeTab, setActiveTab] = useState("all");
    const [_isPending, startTransition] = useTransition();

    const handleRemove = (animeId: string) => {
        if (activeTab === "favorites") {
            // Optimistic update
            setFavorites(prev => prev.filter(item => item.anime.id !== animeId));

            startTransition(async () => {
                const result = await toggleFavorite(animeId);
                if (result.success) {
                    const isFavorite = (result.data as { isFavorite: boolean })?.isFavorite;
                    if (!isFavorite) {
                        toast.success("Favorilerden çıkarıldı");
                    }
                } else {
                    setFavorites(initialFavorites); // Revert on error
                    toast.error(result.error || "Bir hata oluştu");
                }
            });
            return;
        }

        // Optimistic update for watchlist
        setItems(prev => prev.filter(item => item.anime.id !== animeId));

        startTransition(async () => {
            const result = await updateWatchStatus(animeId, null);
            if (result.success) {
                toast.success("Listeden kaldırıldı");
            } else {
                setItems(initialItems); // Revert on error
                toast.error(result.error || "Bir hata oluştu");
            }
        });
    };

    const filteredItems = activeTab === "favorites"
        ? favorites
        : activeTab === "all"
            ? items
            : items.filter(item => item.status === activeTab);

    const activeTabLabel = TABS.find(tab => tab.id === activeTab)?.label;

    return (
        <div className="w-full">
            <DesktopTabs tabs={TABS} activeTab={activeTab} onTabChange={setActiveTab} />
            <MobileTabDropdown tabs={TABS} activeTab={activeTab} activeTabLabel={activeTabLabel} onTabChange={setActiveTab} />

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {filteredItems.map((item, index) => (
                    <div
                        key={`${activeTab}-${item.anime.id}`}
                        className="w-full animate-fade-in-up"
                        style={{ animationDelay: `${index * 50}ms` }}
                    >
                        <MovieCard
                            id={item.anime.id}
                            title={item.anime.title}
                            year={item.anime.release_year || 0}
                            genres={item.anime.genres}
                            rating={item.anime.score || 0}
                            image={item.anime.poster_url || ""}
                            slug={item.anime.slug}
                            className="w-full"
                            hideWatchButton={true}
                            onRemove={() => handleRemove(item.anime.id)}
                        />
                    </div>
                ))}
            </div>

            {filteredItems.length === 0 && (
                activeTab === "favorites" ? (
                    <EmptyState
                        icon={Heart}
                        title="Henüz Favori Yok"
                        description="Favorilerine henüz bir anime eklenmemiş."
                    />
                ) : (
                    <EmptyState
                        icon={Library}
                        title="Henüz İçerik Yok"
                        description="Bu listeye henüz bir anime eklenmemiş."
                    />
                )
            )}
        </div>
    );
}
