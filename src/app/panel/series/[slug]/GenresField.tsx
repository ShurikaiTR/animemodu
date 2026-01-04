"use client";

import { X } from "lucide-react";
import { useState } from "react";

interface GenresFieldProps {
    genres: string[];
    onChange: (genres: string[]) => void;
}

export function GenresField({ genres, onChange }: GenresFieldProps) {
    const [inputValue, setInputValue] = useState("");

    const handleAddGenre = () => {
        const trimmed = inputValue.trim();
        if (trimmed && !genres.includes(trimmed)) {
            onChange([...genres, trimmed]);
            setInputValue("");
        }
    };

    const handleRemoveGenre = (genreToRemove: string) => {
        onChange(genres.filter(g => g !== genreToRemove));
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            e.preventDefault();
            handleAddGenre();
        } else if (e.key === "Backspace" && inputValue === "" && genres.length > 0) {
            // Remove last genre when backspace is pressed on empty input
            onChange(genres.slice(0, -1));
        }
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-text-main/80">Türler</label>

            <div className="flex flex-wrap items-center gap-2 p-3 rounded-xl bg-bg-secondary/30 border border-white/5 focus-within:bg-bg-secondary/50 transition-colors min-h-12">
                {/* Genre tags */}
                {genres.map((genre) => (
                    <span
                        key={genre}
                        className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md bg-primary/15 text-primary text-sm font-medium"
                    >
                        {genre}
                        <button
                            type="button"
                            onClick={() => handleRemoveGenre(genre)}
                            className="w-4 h-4 rounded hover:bg-primary/30 flex items-center justify-center transition-colors"
                        >
                            <X className="w-3 h-3" />
                        </button>
                    </span>
                ))}

                {/* Input */}
                <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={handleKeyDown}
                    placeholder={genres.length === 0 ? "Tür ekle..." : ""}
                    className="flex-1 min-w-24 bg-transparent text-white text-sm outline-none placeholder:text-text-main/30"
                />
            </div>

            <p className="text-xs text-text-main/40">Enter tuşuyla yeni tür ekleyin, Backspace ile son türü silin.</p>
        </div>
    );
}
