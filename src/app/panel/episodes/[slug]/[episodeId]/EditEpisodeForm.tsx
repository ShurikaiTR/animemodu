"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/shared/components/button";
import { updateEpisode } from "@/features/anime/actions/updateEpisode";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import type { EpisodeManagement } from "@/shared/types/domain/anime";
import { EpisodeFields } from "./EpisodeFields";

interface EditEpisodeFormProps {
    episode: EpisodeManagement;
    animeSlug: string;
}

export function EditEpisodeForm({ episode, animeSlug: _animeSlug }: EditEpisodeFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        formData.set("id", episode.id);
        formData.set("anime_id", episode.anime_id);

        startTransition(async () => {
            const result = await updateEpisode(formData);
            if (result.success) {
                toast.success("Bölüm başarıyla güncellendi.");
                router.push(`/panel/episodes`);
            } else {
                toast.error("Güncelleme hatası: " + result.error);
            }
        });
    };

    return (
        <div className="max-w-3xl">
            <form action={handleSubmit} className="space-y-6">
                <EpisodeFields episode={episode} />

                <div className="flex items-center justify-between">
                    <Button
                        type="button"
                        variant="ghost"
                        asChild
                        className="text-white/70 hover:text-white hover:bg-white/5"
                    >
                        <Link href="/panel/episodes">
                            <ArrowLeft className="w-4 h-4 mr-2" />
                            Geri Dön
                        </Link>
                    </Button>

                    <Button
                        type="submit"
                        disabled={isPending}
                        className="bg-primary hover:bg-primary/90 text-white"
                    >
                        {isPending ? (
                            <>
                                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                Kaydediliyor...
                            </>
                        ) : (
                            <>
                                <Save className="w-4 h-4 mr-2" />
                                Kaydet
                            </>
                        )}
                    </Button>
                </div>
            </form>
        </div>
    );
}
