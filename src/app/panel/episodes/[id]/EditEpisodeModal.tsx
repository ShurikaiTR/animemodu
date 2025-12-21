"use client";

import { useTransition } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { updateEpisode } from "@/actions/anime/updateEpisode";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import type { EpisodeManagement } from "@/types/domain/anime";

interface EditEpisodeModalProps {
    episode: EpisodeManagement | null;
    isOpen: boolean;
    onClose: () => void;
    onUpdate: () => void;
}


export function EditEpisodeModal({ episode, isOpen, onClose, onUpdate }: EditEpisodeModalProps) {
    const [isPending, startTransition] = useTransition();

    if (!episode) return null;

    const handleSubmit = async (formData: FormData) => {
        formData.set("id", episode.id.toString());
        formData.set("anime_id", episode.anime_id.toString());

        startTransition(async () => {
            const result = await updateEpisode(formData);
            if (result.success) {
                toast.success("Bölüm başarıyla güncellendi.");
                onUpdate();
                onClose();
            } else {
                toast.error("Güncelleme hatası: " + result.error);
            }
        });
    };

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="bg-bg-main/95 border-white/5 text-white max-w-2xl max-h-[90vh] overflow-y-auto sm:max-h-screen">
                <DialogHeader>
                    <DialogTitle>Bölüm Düzenle: S{episode.season_number} B{episode.episode_number}</DialogTitle>
                    <DialogDescription className="text-white/50">
                        Bölüm detaylarını aşağıdan düzenleyebilirsiniz.
                    </DialogDescription>
                </DialogHeader>

                <form action={handleSubmit} className="space-y-4 py-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Bölüm Başlığı</Label>
                            <Input
                                id="title"
                                name="title"
                                defaultValue={episode.title || ""}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            />
                        </div>
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
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="overview">Özet</Label>
                        <Textarea
                            id="overview"
                            name="overview"
                            defaultValue={episode.overview || ""}
                            rows={4}
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                        />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                            <Label htmlFor="duration">Süre (Dk)</Label>
                            <Input
                                id="duration"
                                name="duration"
                                type="number"
                                defaultValue={episode.duration || 0}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50"
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="still_path">Resim Yolu</Label>
                            <Input
                                id="still_path"
                                name="still_path"
                                defaultValue={episode.still_path || ""}
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 text-xs font-mono"
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="video_url">Video URL / Embed Linki</Label>
                        <Input
                            id="video_url"
                            name="video_url"
                            defaultValue={episode.video_url || ""}
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 text-xs font-mono"
                            placeholder="https://.../video.m3u8 veya iframe src"
                        />
                        <p className="text-xs text-white/40">Desteklenen: .m3u8 (HLS), .mp4 veya Embed URL</p>
                    </div>

                    <DialogFooter className="pt-4">
                        <Button type="button" variant="ghost" onClick={onClose} className="hover:bg-white/5 text-white/70">
                            İptal
                        </Button>
                        <Button type="submit" disabled={isPending} className="bg-primary hover:bg-primary/90 text-white">
                            {isPending ? <> <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Kaydediliyor... </> : "Kaydet"}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
