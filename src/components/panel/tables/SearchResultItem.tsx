"use client";

import { ArrowRight,Calendar, Sparkles, Star } from "lucide-react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";

interface SearchResult {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    media_type: "movie" | "tv";
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
}

interface SearchResultItemProps {
    item: SearchResult;
    onClick: (item: SearchResult) => void;
}

export function SearchResultItem({ item, onClick }: SearchResultItemProps) {
    return (
        <div
            onClick={() => onClick(item)}
            className="group relative bg-bg-secondary/30 backdrop-blur-sm border border-white/5 rounded-xl p-4 flex gap-5 cursor-pointer hover:border-white/10 hover:bg-white/[0.03] transition-all duration-200"
        >
            <div className="relative w-20 h-32 shrink-0 rounded-lg overflow-hidden shadow-lg bg-black/50 border border-white/5">
                {item.poster_path ? (
                    <Image
                        src={`https://image.tmdb.org/t/p/w200${item.poster_path}`}
                        alt="Poster"
                        fill
                        sizes="80px"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                ) : (
                    <div className="w-full h-full flex items-center justify-center text-white/10">
                        <Sparkles className="w-6 h-6" />
                    </div>
                )}
            </div>

            <div className="flex-1 min-w-0 flex flex-col">
                <div className="flex items-start justify-between gap-4 mb-1">
                    <h3 className="text-base font-bold text-white font-rubik group-hover:text-primary transition-colors truncate pr-2">
                        {item.title || item.name}
                    </h3>
                    <span className={cn(
                        "px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wide whitespace-nowrap",
                        item.media_type === "movie"
                            ? "bg-purple-500/10 text-purple-400 border-purple-500/20"
                            : "bg-blue-500/10 text-blue-400 border-blue-500/20"
                    )}>
                        {item.media_type === 'movie' ? 'Film' : 'Dizi'}
                    </span>
                </div>

                <div className="text-xs text-text-main/40 mb-2 font-mono truncate">
                    {item.original_title || item.original_name}
                </div>

                <p className="text-sm text-text-main/60 line-clamp-2 leading-relaxed mb-auto">
                    {item.overview || "Açıklama bulunamadı."}
                </p>

                <div className="flex items-center gap-4 mt-3 border-t border-white/5 pt-3">
                    <div className="flex items-center gap-1.5 text-xs font-medium text-text-main/50">
                        <Calendar className="w-3.5 h-3.5 opacity-70" />
                        {(item.release_date || item.first_air_date)?.substring(0, 4) || "-"}
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-yellow-500">
                        <Star className="w-3.5 h-3.5 fill-current" />
                        {item.vote_average.toFixed(1)}
                    </div>
                    <div className="ml-auto flex items-center gap-1 text-primary text-xs font-bold opacity-0 group-hover:opacity-100 transition-all transform translate-x-2 group-hover:translate-x-0">
                        Veritabanına Ekle <ArrowRight className="w-3.5 h-3.5" />
                    </div>
                </div>
            </div>
        </div>
    );
}
