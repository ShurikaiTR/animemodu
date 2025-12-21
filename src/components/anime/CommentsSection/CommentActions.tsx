
"use client";

import { cn } from "@/lib/utils";
import { ThumbsUp, MessageCircle, Pin } from "lucide-react";

interface CommentActionsProps {
    liked: boolean;
    likeCount: number;
    isLiking: boolean;
    isPinned: boolean;
    isAdmin: boolean;
    showReplyInput: boolean;
    onLike: () => void;
    onToggleReply: () => void;
    onPin: () => void;
    repliesCount?: number;
}

export default function CommentActions({
    liked,
    likeCount,
    isLiking,
    isPinned,
    isAdmin,
    showReplyInput,
    onLike,
    onToggleReply,
    onPin,
    repliesCount
}: CommentActionsProps) {
    return (
        <div className="flex items-center gap-1">
            <button
                onClick={onLike}
                disabled={isLiking}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    liked ? "text-primary bg-primary/10" : "text-white/40 hover:text-primary hover:bg-white/5",
                    isLiking && "opacity-50 cursor-not-allowed"
                )}
            >
                <ThumbsUp className={cn("w-4 h-4 transition-transform", liked && "fill-current scale-110")} />
                {likeCount}
            </button>
            <button
                onClick={onToggleReply}
                className={cn(
                    "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                    showReplyInput ? "text-primary bg-primary/10" : "text-white/40 hover:text-primary hover:bg-white/5"
                )}
            >
                <MessageCircle className="w-4 h-4" /> Yanıtla
            </button>
            {isAdmin && (
                <button
                    onClick={onPin}
                    className={cn(
                        "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all",
                        isPinned ? "text-primary bg-primary/10" : "text-white/40 hover:text-primary hover:bg-white/5"
                    )}
                >
                    <Pin className="w-4 h-4" /> {isPinned ? "Kaldır" : "Sabitle"}
                </button>
            )}
            {repliesCount && repliesCount > 0 ? <span className="text-xs text-white/30 ml-2">{repliesCount} yanıt</span> : null}
        </div>
    );
}
