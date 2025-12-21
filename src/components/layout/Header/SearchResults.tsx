"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Film, Tv } from "lucide-react";

interface SearchResult {
    id: string;
    title: string;
    original_title: string | null;
    slug: string;
    poster_path: string | null;
    media_type: string;
    release_date: string | null;
    vote_average: number | null;
}

interface SearchResultsProps {
    results: SearchResult[];
    isLoading: boolean;
    query: string;
    onResultClick: () => void;
}

export default function SearchResults({ results, isLoading, query, onResultClick }: SearchResultsProps) {
    if (!query || query.length < 2) return null;

    return (
        <div className="absolute top-full left-0 right-0 xl:right-auto mt-2 w-full xl:w-96 bg-bg-secondary/95 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden z-[100]">
            {isLoading ? (
                <div className="p-4 text-center">
                    <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin mx-auto" />
                </div>
            ) : results.length > 0 ? (
                <div className="max-h-96 overflow-y-auto">
                    {results.map((item) => (
                        <Link
                            key={item.id}
                            href={`/anime/${item.slug}`}
                            onClick={onResultClick}
                            className="flex items-center gap-3 p-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-b-0"
                        >
                            <div className="relative w-12 h-16 rounded-lg overflow-hidden flex-shrink-0 bg-white/5">
                                {item.poster_path ? (
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w92${item.poster_path}`}
                                        alt={item.title}
                                        fill
                                        sizes="92px"
                                        className="object-cover"
                                    />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center">
                                        {item.media_type === "movie" ? (
                                            <Film className="w-5 h-5 text-white/20" />
                                        ) : (
                                            <Tv className="w-5 h-5 text-white/20" />
                                        )}
                                    </div>
                                )}
                            </div>
                            <div className="flex-1 min-w-0">
                                <h4 className="text-sm font-medium text-white truncate">{item.title}</h4>
                                {item.original_title && item.original_title !== item.title && (
                                    <p className="text-xs text-white/40 truncate">{item.original_title}</p>
                                )}
                                <div className="flex items-center gap-2 mt-1">
                                    {item.vote_average && item.vote_average > 0 && (
                                        <span className="flex items-center gap-1 text-xs text-primary">
                                            <Star className="w-3 h-3 fill-primary" />
                                            {item.vote_average.toFixed(1)}
                                        </span>
                                    )}
                                    {item.release_date && (
                                        <span className="text-xs text-white/40">
                                            {new Date(item.release_date).getFullYear()}
                                        </span>
                                    )}
                                    <span className="text-xs text-white/30 uppercase">
                                        {item.media_type === "movie" ? "Film" : "Dizi"}
                                    </span>
                                </div>
                            </div>
                        </Link>
                    ))}
                </div>
            ) : (
                <div className="p-4 text-center text-white/40 text-sm">
                    &quot;{query}&quot; için sonuç bulunamadı
                </div>
            )}
        </div>
    );
}

