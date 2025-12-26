"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ScrollButtonProps {
    direction: "left" | "right";
    onClick: () => void;
    className?: string;
}

export default function ScrollButton({ direction, onClick, className }: ScrollButtonProps) {
    const Icon = direction === "left" ? ChevronLeft : ChevronRight;
    const label = direction === "left" ? "Önceki" : "Sonraki";

    return (
        <button
            onClick={onClick}
            className={cn(
                "w-10 h-10 rounded-full bg-bg-secondary border border-white/5",
                "flex items-center justify-center text-white",
                "hover:bg-primary hover:text-white transition-all active:scale-95",
                className
            )}
            aria-label={label}
        >
            <Icon className="w-5 h-5" />
        </button>
    );
}
