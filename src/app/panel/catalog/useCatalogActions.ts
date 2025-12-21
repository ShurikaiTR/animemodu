"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import { logError, getErrorMessage } from "@/lib/errors";
import { deleteAnime } from "@/actions/anime/deleteAnime";
import { updateEpisodes } from "@/actions/anime/updateEpisodes";
import type { Database } from "@/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface UseCatalogActionsOptions {
    onAnimesChange: React.Dispatch<React.SetStateAction<AnimeRow[]>>;
}

export function useCatalogActions({ onAnimesChange }: UseCatalogActionsOptions) {
    const [updatingAnimeId, setUpdatingAnimeId] = useState<number | null>(null);
    const [deleteAnimeId, setDeleteAnimeId] = useState<number | null>(null);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = () => {
        if (!deleteAnimeId) return;

        startTransition(async () => {
            try {
                const result = await deleteAnime(deleteAnimeId);

                if (result.success) {
                    onAnimesChange((prev) => prev.filter((a) => a.id !== deleteAnimeId));
                    toast.success("İçerik ve bağlı tüm veriler başarıyla silindi.");
                    setDeleteAnimeId(null);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                logError("useCatalogActions.handleDelete", error);
                toast.error(getErrorMessage(error, "Silme işlemi sırasında bir hata oluştu."));
            }
        });
    };

    const handleEdit = (item: AnimeRow) => {
        router.push(`/panel/catalog/${item.id}`);
    };

    const handleToggleFeatured = async (item: AnimeRow) => {
        const newValue = !item.is_featured;

        onAnimesChange((prev) => prev.map((a) => (a.id === item.id ? { ...a, is_featured: newValue } : a)));

        const { error } = await supabase.from("animes").update({ is_featured: newValue } as never).eq("id", item.id);

        if (error) {
            toast.error("Güncelleme başarısız.");
            onAnimesChange((prev) => prev.map((a) => (a.id === item.id ? { ...a, is_featured: !newValue } : a)));
        } else {
            toast.success(newValue ? "İçerik öne çıkarıldı! ✨" : "Öne çıkarma kaldırıldı.");
        }
    };

    const handleUpdateEpisodes = async (animeId: number) => {
        setUpdatingAnimeId(animeId);

        try {
            const result = await updateEpisodes(animeId);

            if (result.success) {
                if (result.addedCount > 0) {
                    toast.success(`${result.addedCount} yeni bölüm eklendi! 🎉`);
                } else {
                    toast.info("Güncelleme tamamlandı. Yeni bölüm bulunamadı.");
                }
            } else {
                toast.error(result.error || "Güncelleme başarısız.");
            }
        } catch (error) {
            logError("useCatalogActions.handleUpdateEpisodes", error);
            toast.error(getErrorMessage(error, "Güncelleme sırasında bir hata oluştu."));
        } finally {
            setUpdatingAnimeId(null);
        }
    };

    return {
        deleteAnimeId,
        setDeleteAnimeId,
        updatingAnimeId,
        isPending,
        handleDelete,
        handleEdit,
        handleToggleFeatured,
        handleUpdateEpisodes,
    };
}
