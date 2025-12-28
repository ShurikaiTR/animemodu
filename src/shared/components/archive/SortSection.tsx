"use client";

import { cn } from "@/shared/lib/utils";

const SORT_OPTIONS = [
    { label: "Popüler", value: "populer" },
    { label: "En Yeni", value: "yeni" },
    { label: "IMDb Puanı", value: "puan" },
    { label: "İzlenme", value: "izlenme" },
];

interface SortSectionProps {
    currentSort: string;
    onSortChange: (value: string) => void;
}

export default function SortSection({ currentSort, onSortChange }: SortSectionProps) {
    return (
        <div className="mb-8 space-y-3">
            <h3 className="text-sm font-bold text-white/50 uppercase tracking-wider font-rubik">Sıralama</h3>
            <div className="space-y-1">
                {SORT_OPTIONS.map((option) => (
                    <button
                        key={option.value}
                        onClick={() => onSortChange(option.value)}
                        className={cn(
                            "w-full text-left px-3 py-2 rounded-lg text-sm transition-all flex items-center justify-between group",
                            currentSort === option.value
                                ? "bg-primary/10 text-primary font-medium"
                                : "text-text-main hover:bg-primary/5 hover:text-primary"
                        )}
                    >
                        {option.label}
                        {currentSort === option.value && <div className="w-1.5 h-1.5 rounded-full bg-primary" />}
                    </button>
                ))}
            </div>
        </div>
    );
}











