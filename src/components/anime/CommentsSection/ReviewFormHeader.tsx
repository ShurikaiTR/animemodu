"use client";

import { Input } from "@/components/ui/input";
import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface ReviewFormHeaderProps {
    title: string;
    setTitle: (value: string) => void;
    rating: number;
    setRating: (value: number) => void;
    hoverRating: number;
    setHoverRating: (value: number) => void;
}

export default function ReviewFormHeader({
    title,
    setTitle,
    rating,
    setRating,
    hoverRating,
    setHoverRating
}: ReviewFormHeaderProps) {
    return (
        <div className="p-5 space-y-5 border-b border-white/5">
            <div className="space-y-2">
                <label className="flex items-center justify-between text-xs font-medium text-white/50 uppercase tracking-wider">
                    <span>İnceleme Başlığı</span>
                    <span className={cn("tabular-nums", title.length > 80 ? "text-red-400" : "")}>{title.length}/100</span>
                </label>
                <Input
                    value={title}
                    onChange={(e) => setTitle(e.target.value.slice(0, 100))}
                    placeholder="Harika bir başlık ile dikkat çek..."
                    className="bg-white/[0.03] border-white/[0.08] text-white placeholder:text-white/25 text-base h-12 rounded-xl focus-visible:ring-1 focus-visible:ring-primary/50 focus-visible:border-primary/30 transition-all"
                />
            </div>

            <div className="space-y-3">
                <label className="text-xs font-medium text-white/50 uppercase tracking-wider">Puanın</label>
                <div className="flex items-center gap-2 p-4 rounded-xl bg-gradient-to-r from-primary/[0.08] to-transparent border border-primary/10">
                    <div className="flex items-center gap-0.5">
                        {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((star) => (
                            <button
                                key={star}
                                type="button"
                                onMouseEnter={() => setHoverRating(star)}
                                onMouseLeave={() => setHoverRating(0)}
                                onClick={() => setRating(star)}
                                className="p-1 transition-all duration-200 hover:scale-125 active:scale-95"
                            >
                                <Star className={cn(
                                    "w-6 h-6 transition-all duration-200",
                                    (hoverRating ? star <= hoverRating : star <= rating)
                                        ? "fill-primary text-primary drop-shadow-[var(--shadow-primary-glow-sm)]"
                                        : "text-white/15 hover:text-primary/40"
                                )} />
                            </button>
                        ))}
                    </div>
                    <div className="ml-auto flex items-baseline gap-1">
                        <span className={cn(
                            "text-3xl font-bold tabular-nums transition-colors",
                            (hoverRating || rating) ? "text-primary" : "text-white/20"
                        )}>
                            {hoverRating || rating || "—"}
                        </span>
                        <span className="text-sm text-white/30 font-medium">/10</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
