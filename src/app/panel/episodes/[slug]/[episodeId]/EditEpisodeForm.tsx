"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { updateEpisode } from "@/features/anime/actions/updateEpisode";
import { deleteEpisode } from "@/features/anime/actions/deleteEpisode";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save, Trash2 } from "lucide-react";
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
        <div className="bg-bg-secondary/40 border border-white/5 rounded-2xl shadow-sm overflow-hidden backdrop-blur-md">
            <form action={handleSubmit} className="divide-y divide-white/5">
                <EpisodeFields episode={episode} />

                <div className="px-6 lg:px-8 py-5 bg-white/[0.02] flex flex-col-reverse sm:flex-row items-center justify-between gap-4">
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

                        <button
                            type="submit"
                            disabled={isPending}
                            className="flex-1 sm:flex-none px-8 py-2.5 bg-primary text-white font-inter text-sm font-semibold rounded-xl shadow-lg shadow-primary/20 transition-all hover:bg-primary/90 hover:shadow-primary/40 active:scale-95 disabled:opacity-50 disabled:active:scale-100 flex items-center justify-center gap-2"
                        >
                            {isPending ? (
                                <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                                <Save className="w-4 h-4" />
                            )}
                            Kaydet
                        </button>
                    </div>
                </div>
            </form>
        </div>
    );
}
