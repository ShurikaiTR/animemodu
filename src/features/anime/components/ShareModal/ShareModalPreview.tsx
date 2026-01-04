"use client";

import { Play } from "lucide-react";
import Image from "next/image";

interface ShareModalPreviewProps {
    ogImage: string;
    animeTitle: string;
    episodeTitle: string;
    contentType: "anime" | "movie";
}

export default function ShareModalPreview({
    ogImage,
    animeTitle,
    episodeTitle,
    contentType
}: ShareModalPreviewProps) {
    return (
        <div className="group relative w-full aspect-video rounded-xl overflow-hidden shadow-lg border border-white/5">
            <Image
                alt={animeTitle}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                src={ogImage}
                fill
                sizes="(max-width: 768px) 100vw, 400px"
            />

            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

            {/* Hover shadow effect */}
            <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />

            {/* Play button - EpisodeCard style */}
            <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                <div className="w-14 h-14 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(47,128,237,0.4)] scale-50 group-hover:scale-100 transition-transform duration-500">
                    <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center shadow-lg text-white">
                        <Play className="w-5 h-5 ml-0.5 fill-current" />
                    </div>
                </div>
            </div>

            {/* Content type badge */}
            <div className="absolute top-3 left-3 z-10">
                <span className="text-[10px] font-bold uppercase tracking-wider text-white bg-primary px-2 py-1 rounded-lg shadow-sm">
                    {contentType === "anime" ? "Anime" : "Film"}
                </span>
            </div>

            {/* Info overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                <h3 className="text-white font-bold font-rubik text-lg line-clamp-1 group-hover:text-primary transition-colors drop-shadow-md">
                    {animeTitle}
                </h3>
                <div className="flex items-center gap-2 text-sm text-white/70 font-medium mt-0.5">
                    <span className="text-primary font-bold">{episodeTitle}</span>
                </div>
            </div>

            {/* Hover border effect */}
            <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-xl transition-colors duration-500 pointer-events-none" />
        </div>
    );
}
