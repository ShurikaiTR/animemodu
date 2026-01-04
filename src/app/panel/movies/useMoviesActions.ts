"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { deleteAnime } from "@/features/anime/actions/delete-actions"; // Action is generic enough
import { getErrorMessage,logError } from "@/shared/lib/errors";
import { createClient } from "@/shared/lib/supabase/client";
import type { Database } from "@/shared/types/supabase";

type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

interface UseMoviesActionsOptions {
    onMoviesChange: React.Dispatch<React.SetStateAction<AnimeRow[]>>;
}

export function useMoviesActions({ onMoviesChange }: UseMoviesActionsOptions) {
    const [deleteMovieId, setDeleteMovieId] = useState<string | null>(null);
    const [isPending, startTransition] = useTransition();
    const supabase = createClient();
    const router = useRouter();

    const handleDelete = () => {
        if (!deleteMovieId) return;

        startTransition(async () => {
            try {
                const result = await deleteAnime(deleteMovieId);

                if (result.success) {
                    onMoviesChange((prev) => prev.filter((m) => m.id !== deleteMovieId));
                    toast.success("Film ve bağlı veriler başarıyla silindi.");
                    setDeleteMovieId(null);
                } else {
                    throw new Error(result.error);
                }
            } catch (error) {
                logError("useMoviesActions.handleDelete", error);
                toast.error(getErrorMessage(error, "Silme işlemi sırasında bir hata oluştu."));
            }
        });
    };

    const handleEdit = (item: AnimeRow) => {
        router.push(`/panel/movies/${item.id}`);
    };

    const handleToggleFeatured = async (item: AnimeRow) => {
        const newValue = !item.is_featured;

        onMoviesChange((prev) => prev.map((m) => (m.id === item.id ? { ...m, is_featured: newValue } : m)));

        const { error } = await supabase.from("animes").update({ is_featured: newValue }).eq("id", item.id);

        if (error) {
            toast.error("Güncelleme başarısız.");
            onMoviesChange((prev) => prev.map((m) => (m.id === item.id ? { ...m, is_featured: !newValue } : m)));
        } else {
            toast.success(newValue ? "Film öne çıkarıldı! ✨" : "Öne çıkarma kaldırıldı.");
        }
    };

    return {
        deleteMovieId,
        setDeleteMovieId,
        isPending,
        handleDelete,
        handleEdit,
        handleToggleFeatured,
    };
}
