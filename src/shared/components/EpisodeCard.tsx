"use client";

import Image from "next/image";
import Link from "next/link";
import { Play } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface EpisodeCardProps {
    title: string;
    episodeNumber: string;
    image: string;
    timeAgo: string;
    href?: string;
    className?: string;
    variant?: "vertical" | "horizontal";
}

export default function EpisodeCard({
    title,
    episodeNumber,
    image,
    timeAgo,
    href = "#",
    className
}: EpisodeCardProps) {
    return (
        <div className={cn("group relative w-full aspect-video rounded-2xl overflow-hidden cursor-pointer", className)}>
            <Link href={href} className="block w-full h-full relative">

                <Image
                    src={image}
                    alt={title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-90 group-hover:opacity-80 transition-opacity duration-500" />

                <div className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none shadow-[inset_0_0_60px_rgba(0,0,0,0.8)]" />

                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 z-10">
                    <div className="w-12 h-12 rounded-full bg-primary/20 backdrop-blur-sm border border-primary/50 flex items-center justify-center shadow-[0_0_30px_rgba(47,128,237,0.4)] scale-50 group-hover:scale-100 transition-transform duration-500">
                        <div className="w-9 h-9 rounded-full bg-primary flex items-center justify-center shadow-lg text-white">
                            <Play className="w-4 h-4 ml-0.5 fill-current" />
                        </div>
                    </div>
                </div>

                <div className="absolute top-2 right-2 z-10">
                    <span className="px-2 py-1 bg-black/60 backdrop-blur-md rounded-lg text-xs font-bold text-white/90 border border-white/10 flex items-center gap-1 shadow-lg">
                        {timeAgo}
                    </span>
                </div>

                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-2 group-hover:translate-y-0 transition-transform duration-500 ease-out z-20">
                    <h3 className="text-white font-bold font-rubik text-sm line-clamp-1 group-hover:text-primary transition-colors drop-shadow-md">
                        {title}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-white/70 font-medium mt-0.5">
                        <span className="text-primary font-bold">{episodeNumber}</span>
                    </div>
                </div>

                <div className="absolute inset-0 border-2 border-primary/0 group-hover:border-primary/50 rounded-2xl transition-colors duration-500 pointer-events-none" />

            </Link>
        </div>
    );
}
