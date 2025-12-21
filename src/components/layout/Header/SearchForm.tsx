"use client";

import { useState, useEffect, useRef } from "react";
import { cn } from "@/lib/utils";
import { SearchIcon, CloseIcon } from "./HeaderIcons";
import SearchResults from "./SearchResults";

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

interface SearchFormProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    query: string;
    setQuery: (query: string) => void;
    onSubmit: (e: React.FormEvent) => void;
}

export default function SearchForm({ isOpen, setIsOpen, query, setQuery, onSubmit }: SearchFormProps) {
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showResults, setShowResults] = useState(false);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        const handleClickOutside = (e: MouseEvent) => {
            if (formRef.current && !formRef.current.contains(e.target as Node)) {
                setShowResults(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            setShowResults(false);
            return;
        }

        const debounceTimer = setTimeout(async () => {
            setIsLoading(true);
            setShowResults(true);
            try {
                const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                const data = await res.json();
                setResults(data.results || []);
            } catch {
                setResults([]);
            } finally {
                setIsLoading(false);
            }
        }, 300);

        return () => clearTimeout(debounceTimer);
    }, [query]);

    const handleResultClick = () => {
        setShowResults(false);
        setQuery("");
        setIsOpen(false);
    };

    return (
        <>
            <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="xl:hidden flex items-center justify-center text-primary hover:text-white transition-colors duration-300"
                aria-label="Aramayı aç"
            >
                <SearchIcon />
            </button>

            <form
                ref={formRef}
                onSubmit={onSubmit}
                className={cn(
                    "xl:relative xl:opacity-100 xl:pointer-events-auto xl:w-[250px] xl:top-auto xl:left-auto xl:right-auto xl:bottom-auto",
                    "absolute left-0 right-0 top-auto",
                    "h-20 xl:h-auto",
                    "bg-bg-main xl:bg-transparent",
                    "flex flex-row items-center justify-start",
                    "px-4 xl:px-0",
                    "pointer-events-none xl:pointer-events-auto",
                    "transition-all duration-500 z-50",
                    isOpen ? "bottom-0 pointer-events-auto" : "bottom-[-80px] pointer-events-none"
                )}
            >
                <div className="relative w-full xl:w-full">
                    <label htmlFor="search-input" className="sr-only">Anime ara</label>
                    <input
                        id="search-input"
                        autoComplete="off"
                        type="text"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onFocus={() => query.length >= 2 && setShowResults(true)}
                        placeholder="Anime ara..."
                        className={cn(
                            "h-10 rounded-2xl bg-bg-secondary border-none pl-5 pr-12",
                            "text-sm text-white placeholder:text-text-main/70",
                            "focus:outline-none focus:ring-0 transition-all duration-300",
                            "w-[calc(100%-40px)] xl:w-full"
                        )}
                    />
                    <button
                        type="submit"
                        className={cn(
                            "absolute top-1/2 -translate-y-1/2 flex items-center justify-center w-5 h-5",
                            "text-primary hover:text-white transition-colors duration-300 z-10",
                            "right-[52px] xl:right-4"
                        )}
                        aria-label="Ara"
                    >
                        <SearchIcon />
                    </button>
                    <button
                        type="button"
                        onClick={() => { setIsOpen(false); setQuery(""); setShowResults(false); }}
                        className="absolute right-0 xl:hidden top-1/2 -translate-y-1/2 flex items-center justify-center w-[40px] h-full text-primary/70 hover:text-primary transition-opacity duration-300 z-10"
                        aria-label="Aramayı kapat"
                    >
                        <CloseIcon />
                    </button>

                    {showResults && (
                        <SearchResults
                            results={results}
                            isLoading={isLoading}
                            query={query}
                            onResultClick={handleResultClick}
                        />
                    )}
                </div>
            </form>
        </>
    );
}
