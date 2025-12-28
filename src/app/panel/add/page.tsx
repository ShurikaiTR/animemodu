"use client";

import { useState } from "react";
import { Search, Loader2 } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { AddContentModal } from "@/components/panel/modals/AddContentModal";
import { SearchResultItem } from "@/components/panel/tables/SearchResultItem";
import type { SearchResult } from "../types";

export default function AddAnimePage() {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<SearchResult[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [selectedItem, setSelectedItem] = useState<SearchResult | null>(null);
    const [isModalOpen, setIsModalOpen] = useState(false);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!query.trim()) return;

        setIsLoading(true);
        try {
            const res = await fetch(`/api/tmdb/search?query=${encodeURIComponent(query)}`);
            const data = await res.json();
            setResults(data.error ? [] : (data.results || []));
        } catch {
            setResults([]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20">
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-3xl font-rubik font-bold text-white mb-2">
                            Yeni İçerik Ekle
                        </h2>
                        <p className="text-text-main/60 text-sm">TMDB veritabanında arama yaparak yeni içerik oluşturun.</p>
                    </div>
                </div>
            </div>

            <form onSubmit={handleSearch} className="relative group w-full">
                <div className="relative flex items-center">
                    <Search className="absolute left-4 w-5 h-5 text-text-main/40" />
                    <Input
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Anime, film veya dizi adı arayın..."
                        className="h-14 pl-12 bg-bg-secondary/30 border-none text-white placeholder:text-text-main/30 text-base focus:bg-bg-secondary/50 rounded-xl transition-all shadow-sm focus-visible:ring-0"
                    />
                    <Button
                        type="submit"
                        className="absolute right-2 h-10 px-6 rounded-lg text-sm font-bold bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20"
                        disabled={isLoading}
                    >
                        {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Ara"}
                    </Button>
                </div>
            </form>

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
                {results.map((item) => (
                    <SearchResultItem
                        key={item.id}
                        item={item}
                        onClick={() => {
                            setSelectedItem(item);
                            setIsModalOpen(true);
                        }}
                    />
                ))}

                {!isLoading && results.length === 0 && query && (
                    <div className="col-span-full py-24 flex flex-col items-center justify-center text-text-main/20 border border-dashed border-white/5 rounded-2xl bg-bg-secondary/10">
                        <Search className="w-12 h-12 opacity-20 mb-4" />
                        <p className="text-base font-medium">Sonuç bulunamadı.</p>
                    </div>
                )}
            </div>

            <AddContentModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                item={selectedItem}
            />
        </div>
    );
}
