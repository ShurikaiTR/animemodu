"use client";

import { MessageCircle, ShieldCheck,ThumbsUp } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";

import { Badge } from "@/shared/components/badge";
import { cn, getAvatarUrl } from "@/shared/lib/utils";

import CommentInput from "./CommentInput";
import type { Reply } from "./types";

interface ReplyItemProps {
    reply: Reply;
    parentId: string;
    animeId: string;
    episodeId?: string;
    onReplyAdded: () => void;
    isLast?: boolean;
}

export default function ReplyItem({ reply, parentId, animeId, episodeId, onReplyAdded, isLast }: ReplyItemProps) {
    const [showReplyInput, setShowReplyInput] = useState(false);
    const [liked, setLiked] = useState(false);

    return (
        <div className="relative py-3 first:pt-0">
            <div className={cn(
                "absolute left-0 top-4 w-5 h-px bg-gradient-to-r from-primary/30 to-transparent",
                isLast && "before:absolute before:left-0 before:-top-4 before:w-px before:h-4 before:bg-primary/20"
            )} />

            <div className="flex gap-3 pl-7">
                <div className="shrink-0">
                    <div className={cn(
                        "relative w-9 h-9 rounded-full overflow-hidden transition-all",
                        reply.role === "Admin"
                            ? "ring-2 ring-primary/60 shadow-[var(--shadow-primary-glow-md)]"
                            : "ring-1 ring-white/10"
                    )}>
                        {reply.avatarUrl ? (
                            <Image src={getAvatarUrl(reply.avatarUrl)} alt={reply.author} fill className="object-cover" sizes="36px" />
                        ) : (
                            <div className={cn("w-full h-full flex items-center justify-center text-white font-semibold text-xs bg-white/10", reply.avatarColor)}>
                                {reply.author[0].toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <Link href={`/profil/${reply.username}`} className={cn("font-semibold text-sm hover:underline", reply.role === "Admin" ? "text-primary" : "text-white/90")}>
                            {reply.author}
                        </Link>
                        {reply.role === "Admin" && (
                            <Badge variant="blue" className="px-2 py-0.5 font-bold rounded-full text-xs flex items-center gap-1">
                                <ShieldCheck className="w-3 h-3" />
                                Yönetici
                            </Badge>
                        )}
                        <span className="text-white/20">•</span>
                        <span className="text-white/40 text-xs">{reply.timeAgo}</span>
                    </div>

                    <p className="text-sm leading-relaxed text-white/60 mb-2">{reply.content}</p>

                    <div className="flex items-center gap-1">
                        <button onClick={() => setLiked(!liked)} className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                            liked ? "text-primary bg-primary/10" : "text-white/30 hover:text-primary hover:bg-white/5"
                        )}>
                            <ThumbsUp className={cn("w-3.5 h-3.5 transition-transform", liked && "fill-current scale-110")} />
                            {(reply.likes || 0) + (liked ? 1 : 0)}
                        </button>
                        <button onClick={() => setShowReplyInput(!showReplyInput)} className={cn(
                            "flex items-center gap-1 px-2 py-1 rounded-md text-xs font-medium transition-all",
                            showReplyInput ? "text-primary bg-primary/10" : "text-white/30 hover:text-primary hover:bg-white/5"
                        )}>
                            <MessageCircle className="w-3.5 h-3.5" />
                            Yanıtla
                        </button>
                    </div>

                    {showReplyInput && (
                        <div className="mt-3">
                            <CommentInput activeTab="comments" animeId={animeId} episodeId={episodeId} parentId={parentId} onCommentAdded={() => { setShowReplyInput(false); onReplyAdded(); }} />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
