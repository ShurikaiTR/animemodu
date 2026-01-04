"use client";

import { ArrowLeft, Loader2, Save, Trash2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { deleteEpisode } from "@/features/anime/actions/delete-actions";
import { updateEpisode } from "@/features/anime/actions/update-actions";
import { Button } from "@/shared/components/button";
import type { EpisodeManagement } from "@/shared/types/domain/anime";

import { EpisodeFields } from "./EpisodeFields";

interface EditEpisodeFormProps {
    episode: EpisodeManagement;
    animeSlug: string;
}

export function EditEpisodeForm({ episode, animeSlug }: EditEpisodeFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        formData.set("id", episode.id);
        formData.set("anime_id", episode.anime_id);

        startTransition(async () => {
            const result = await updateEpisode(formData);
            if (result.success) {
                toast.success("Bölüm başarıyla güncellendi.");
                router.refresh();
            } else {
                toast.error("Güncelleme hatası: " + result.error);
            }
        });
    };

    const handleDelete = async () => {
        if (!confirm("Bu bölümü silmek istediğinize emin misiniz?")) return;

        startTransition(async () => {
            const result = await deleteEpisode(episode.id, animeSlug);
            if (result.success) {
                toast.success("Bölüm başarıyla silindi.");
                router.push(`/panel/episodes`);
            } else {
                toast.error("Silme hatası: " + result.error);
            }
        });
    };

    return (
        <div className="rounded-2xl overflow-hidden">
            <form action={handleSubmit} className="divide-y divide-white/5">
                <EpisodeFields episode={episode} />

                <div className="px-6 lg:px-8 py-5 flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
                    <Link
                        href="/panel/episodes"
                        className="w-full sm:w-auto px-5 py-2.5 flex items-center justify-center gap-2 font-inter text-sm font-medium text-text-main/60 rounded-xl transition-all hover:bg-white/5 hover:text-white"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        Geri Dön
                    </Link>

                    <div className="flex items-center gap-4 w-full sm:w-auto">
                        <button
                            type="button"
                            onClick={handleDelete}
                            disabled={isPending}
                            className="flex-1 sm:flex-none px-5 py-2.5 font-inter text-sm font-medium text-text-main/40 rounded-xl transition-colors hover:bg-danger/10 hover:text-danger disabled:opacity-50"
                        >
                            <span className="flex items-center justify-center gap-2">
                                <Trash2 className="w-4 h-4" />
                                Sil
                            </span>
                        </button>

                        <Button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 sm:flex-none bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 px-6 py-2.5"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Kaydet
                        </Button>
                    </div>
                </div>
            </form>
        </div>
    );
}
