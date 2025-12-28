"use client";

import { Search } from "lucide-react";
import { Input } from "@/shared/components/input";

interface SearchSectionProps {
    searchQuery: string;
    onSearchChange: (value: string) => void;
}

export default function SearchSection({ searchQuery, onSearchChange }: SearchSectionProps) {
    return (
        <div className="mb-8 space-y-3">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider font-rubik">Arama</h3>
            <div className="relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main group-focus-within:text-primary transition-colors" />
                <Input
                    placeholder="Anime adı..."
                    className="bg-bg-main/50 border-white/10 focus:border-primary/50 pl-10 h-10 text-sm focus-visible:ring-0 focus-visible:ring-offset-0"
                    defaultValue={searchQuery}
                    onChange={(e) => onSearchChange(e.target.value)}
                />
            </div>
        </div>
    );
}























