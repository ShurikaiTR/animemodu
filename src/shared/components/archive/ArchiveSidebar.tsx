"use client";

import { ChevronDown,Filter, X } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { useState } from "react";

import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils";

import GenreSection from "./GenreSection";
import SearchSection from "./SearchSection";
import SortSection from "./SortSection";

interface ArchiveSidebarProps {
    genres: { label: string; value: string }[];
}

export default function ArchiveSidebar({ genres }: ArchiveSidebarProps) {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const currentGenres = searchParams.get("tur")?.split(",") || [];
    const currentSort = searchParams.get("sirala") || "populer";
    const searchQuery = searchParams.get("ara") || "";

    const updateParam = (key: string, value: string) => {
        const params = new URLSearchParams(searchParams.toString());
        if (value) {
            params.set(key, value);
        } else {
            params.delete(key);
        }
        router.push(`?${params.toString()}`);
    };

    const toggleGenre = (value: string) => {
        if (value === "hepsi") {
            updateParam("tur", "");
            return;
        }

        let newGenres = [...currentGenres];
        if (newGenres.includes(value)) {
            newGenres = newGenres.filter(g => g !== value);
        } else {
            newGenres.push(value);
        }

        const genreString = newGenres.filter(Boolean).join(",");
        updateParam("tur", genreString);
    };

    return (
        <>
            <div className="lg:hidden mb-6">
                <Button
                    onClick={() => setIsMobileOpen(true)}
                    className="w-full bg-bg-secondary border border-white/10 text-white flex items-center justify-between"
                >
                    <span className="flex items-center gap-2"><Filter className="w-4 h-4 text-primary" /> Filtrele & Sırala</span>
                    <ChevronDown className="w-4 h-4" />
                </Button>
            </div>

            <div className={cn(
                "fixed inset-0 z-50 lg:z-0 lg:static lg:block bg-black/80 lg:bg-transparent backdrop-blur-sm lg:backdrop-blur-none transition-all duration-300",
                isMobileOpen ? "opacity-100 visible" : "opacity-0 invisible lg:opacity-100 lg:visible"
            )}>
                <div className={cn(
                    "h-full lg:h-auto w-72 lg:w-full bg-bg-secondary/90 lg:bg-transparent backdrop-blur-xl lg:backdrop-blur-none border-r lg:border-none border-white/10 p-6 lg:p-0 overflow-y-auto lg:overflow-visible transition-transform duration-300 ease-out",
                    isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
                )}>
                    <div className="flex items-center justify-between lg:hidden mb-8">
                        <h2 className="text-xl font-bold text-white font-rubik">Filtreler</h2>
                        <button onClick={() => setIsMobileOpen(false)} className="text-text-main hover:text-white">
                            <X className="w-6 h-6" />
                        </button>
                    </div>

                    <SearchSection
                        searchQuery={searchQuery}
                        onSearchChange={(value) => updateParam("ara", value)}
                    />

                    <SortSection
                        currentSort={currentSort}
                        onSortChange={(value) => updateParam("sirala", value)}
                    />

                    <GenreSection
                        genres={genres}
                        currentGenres={currentGenres}
                        onGenreToggle={toggleGenre}
                        onClearGenres={() => updateParam("tur", "")}
                    />
                </div>

                <div className="lg:hidden absolute inset-0 -z-10" onClick={() => setIsMobileOpen(false)} />
            </div>
        </>
    );
}
