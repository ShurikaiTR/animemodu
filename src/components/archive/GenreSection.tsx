"use client";

import { cn } from "@/lib/utils";

interface Genre {
    label: string;
    value: string;
}

interface GenreSectionProps {
    genres: Genre[];
    currentGenres: string[];
    onGenreToggle: (value: string) => void;
    onClearGenres: () => void;
}

export default function GenreSection({ genres, currentGenres, onGenreToggle, onClearGenres }: GenreSectionProps) {
    return (
        <div className="space-y-3">
            <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider font-rubik">Türler</h3>
                {currentGenres.length > 0 && (
                    <button
                        onClick={onClearGenres}
                        className="text-[10px] text-primary hover:underline"
                    >
                        Temizle
                    </button>
                )}
            </div>
            <div className="space-y-1">
                <button
                    onClick={() => onGenreToggle("hepsi")}
                    className={cn(
                        "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group",
                        currentGenres.length === 0
                            ? "bg-primary/10 text-primary font-medium"
                            : "text-text-main hover:bg-primary/5 hover:text-primary"
                    )}
                >
                    Hepsi
                    {currentGenres.length === 0 && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                </button>
                {genres.map((genre) => {
                    const isSelected = currentGenres.includes(genre.value);
                    return (
                        <button
                            key={genre.value}
                            onClick={() => onGenreToggle(genre.value)}
                            className={cn(
                                "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group",
                                isSelected
                                    ? "bg-primary/10 text-primary font-medium"
                                    : "text-text-main hover:bg-primary/5 hover:text-primary"
                            )}
                        >
                            {genre.label}
                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                        </button>
                    );
                })}
            </div>
        </div>
    );
}





















