"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateEpisode } from "@/actions/anime/updateEpisode";
import { toast } from "sonner";
import { Loader2, ArrowLeft, Save } from "lucide-react";
import type { EpisodeManagement } from "@/types/domain/anime";

interface EditEpisodeFormProps {
    episode: EpisodeManagement;
    animeSlug: string;
}

export function EditEpisodeForm({ episode, animeSlug }: EditEpisodeFormProps) {
    const [isPending, startTransition] = useTransition();
    const router = useRouter();

    const handleSubmit = async (formData: FormData) => {
        formData.set("id", episode.id.toString());
        formData.set("anime_id", episode.anime_id.toString());

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
                {/* Episode Info Header */}
                <div className="bg-bg-secondary/30 border border-white/5 rounded-xl p-6 space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="air_date">Yayın Tarihi</Label>
                            <Input
                                id="air_date"
                                name="air_date"
                                type="date"
                                defaultValue={episode.air_date || ""}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="duration">Süre (Dakika)</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                defaultValue={episode.duration || 0}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="overview">Bölüm Özeti</Label>
                        <Textarea
                            id="overview"
                            name="overview"
                            defaultValue={episode.overview || ""}
                            rows={5}
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            placeholder="Bölüm hakkında kısa bir özet..."
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label htmlFor="vote_average">Puan (0-10)</Label>
                            <Input
                                id="vote_average"
                                name="vote_average"
                                type="number"
                                step="0.1"
                                min="0"
                                max="10"
                                defaultValue={episode.vote_average || 0}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="still_path">Bölüm Resmi (URL)</Label>
                            <Input
                                id="still_path"
                                name="still_path"
                                defaultValue={episode.still_path || ""}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 text-xs font-mono"
                                placeholder="/abc123.jpg"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video_url">Video URL / Embed Linki</Label>
                        <Input
                            id="video_url"
                            name="video_url"
                            defaultValue={episode.video_url || ""}
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 text-sm font-mono"
                            placeholder="https://.../video.m3u8 veya iframe src"
                        />
                        <p className="text-xs text-white/40">
                            Desteklenen formatlar: .m3u8 (HLS), .mp4 veya Embed URL
                        </p>
                    </div>
                </div>

                {/* Actions */}
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
