"use client";

import { Input } from "@/shared/components/input";
import { Textarea } from "@/shared/components/textarea";
import { Label } from "@/shared/components/label";
import type { EpisodeManagement } from "@/shared/types/domain/anime";

interface EpisodeFieldsProps {
    episode: EpisodeManagement;
}

export function EpisodeFields({ episode }: EpisodeFieldsProps) {
    return (
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
    );
}
