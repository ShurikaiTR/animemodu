"use client";

import Image from "next/image";
import { Star, Image as ImageIcon, Link as LinkIcon, Film } from "lucide-react";
import { FormField } from "./FormField";
import type { EpisodeManagement } from "@/shared/types/domain/anime";

interface MediaFieldsProps {
    episode: EpisodeManagement;
    stillPath: string;
    setStillPath: (value: string) => void;
}

export function MediaFields({
    episode,
    stillPath,
    setStillPath
}: MediaFieldsProps) {
    return (
        <div className="p-6 lg:p-8 space-y-8 bg-white/[0.01]">
            <h3 className="flex items-center gap-3 font-rubik text-lg font-bold text-white">
                <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-accent-orange/10 text-accent-orange border border-accent-orange/20">
                    <Film className="w-4 h-4" />
                </div>
                Medya & İçerik
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-12 gap-6 lg:gap-8">
                <FormField
                    id="vote_average"
                    label="Puan (0-10)"
                    icon={<Star className="w-5 h-5" />}
                    className="md:col-span-4"
                >
                    <input
                        id="vote_average"
                        name="vote_average"
                        type="number"
                        step="0.1"
                        min="0"
                        max="10"
                        defaultValue={episode.vote_average || 0}
                        className="w-full h-12 pl-11 pr-4 py-2 font-inter text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-accent-orange/50 focus:ring-1 focus:ring-accent-orange/50 outline-none transition-all shadow-sm"
                    />
                </FormField>

                <FormField
                    id="still_path"
                    label="Bölüm Resmi (URL)"
                    icon={<ImageIcon className="w-5 h-5" />}
                    className="md:col-span-8"
                >
                    <div className="flex items-center gap-4">
                        <input
                            id="still_path"
                            name="still_path"
                            value={stillPath}
                            onChange={(e) => setStillPath(e.target.value)}
                            placeholder="/abc123.jpg"
                            className="w-full h-12 pl-11 pr-4 py-2 font-mono text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm"
                        />
                        <div className="relative w-14 h-12 rounded-lg bg-bg-main overflow-hidden shrink-0 border border-white/10 shadow-inner group-hover/preview:scale-105 transition-transform">
                            {stillPath ? (
                                <Image
                                    src={stillPath.startsWith("/") ? `https://image.tmdb.org/t/p/w185${stillPath}` : stillPath}
                                    alt="Preview"
                                    fill
                                    className="object-cover transition-transform group-hover:scale-110"
                                />
                            ) : (
                                <div className="flex items-center justify-center w-full h-full text-[10px] text-white/10 font-mono">Modu</div>
                            )}
                        </div>
                    </div>
                </FormField>
            </div>

            <FormField
                id="video_url"
                label="Video URL / Embed Linki"
                icon={<LinkIcon className="w-5 h-5" />}
            >
                <input
                    id="video_url"
                    name="video_url"
                    defaultValue={episode.video_url || ""}
                    placeholder="https://.../video.m3u8 veya iframe src"
                    className="w-full h-12 pl-11 pr-4 py-2 font-mono text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm"
                />
            </FormField>
            <p className="font-inter text-[11px] font-medium text-text-main/20 mt-1 pl-1">
                Desteklenen formatlar: .m3u8 (HLS), .mp4 veya Embed URL
            </p>
        </div>
    );
}
