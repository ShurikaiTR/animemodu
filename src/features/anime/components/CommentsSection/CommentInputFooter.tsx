
"use client";

import { Eye, EyeOff,Send } from "lucide-react";

import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils";

interface CommentInputFooterProps {
    isSpoiler: boolean;
    isSubmitting: boolean;
    hasContent: boolean;
    onToggleSpoiler: () => void;
    onSubmit: () => void;
}

export default function CommentInputFooter({
    isSpoiler,
    isSubmitting,
    hasContent,
    onToggleSpoiler,
    onSubmit
}: CommentInputFooterProps) {
    return (
        <div className="flex items-center justify-between px-4 pb-3">
            <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={onToggleSpoiler}
                className={cn(
                    "flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-medium transition-all border",
                    isSpoiler ? "bg-primary/10 text-primary border-primary/30" : "bg-white/5 text-white/40 border-transparent hover:text-white/60 hover:bg-white/10"
                )}
            >
                {isSpoiler ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                {isSpoiler ? "Spoiler Aktif" : "Spoiler"}
            </button>

            <Button onClick={onSubmit} disabled={isSubmitting || !hasContent} size="sm" className={cn(
                "h-8 px-4 text-xs font-medium rounded-lg transition-all",
                hasContent ? "bg-primary hover:bg-primary/90 text-white" : "bg-white/5 text-white/30"
            )}>
                {isSubmitting ? "..." : "Gönder"} <Send className="w-3.5 h-3.5 ml-1.5" />
            </Button>
        </div>
    );
}
