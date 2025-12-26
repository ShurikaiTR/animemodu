"use client";

import { useState } from "react";
import Image from "next/image";
import { Pin } from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";
import type { Comment } from "./types";
import CommentInput from "./CommentInput";
import RepliesList from "./RepliesList";
import SpoilerContent from "./SpoilerContent";
import { useAuth } from "@/contexts/AuthContext";
import CommentActions from "./CommentActions";
import CommentHeader from "./CommentHeader";
import { useCommentActions } from "./useCommentActions";

interface CommentItemProps {
    comment: Comment;
    showSpoiler: Record<number, boolean>;
    onToggleSpoiler: (id: number) => void;
    animeId: string;
    episodeId?: number;
    onReplyAdded: () => void;
}

export default function CommentItem({ comment, showSpoiler, onToggleSpoiler, animeId, episodeId, onReplyAdded }: CommentItemProps) {
    const { user, profile } = useAuth();
    const [showReplyInput, setShowReplyInput] = useState(false);
    const isSpoilerVisible = showSpoiler[comment.id] || !comment.isSpoiler;
    const isAdmin = profile?.role === "admin";

    const { liked, likeCount, isLiking, isPinned, handleLike, handlePin } = useCommentActions({
        commentId: comment.id,
        initialLikes: comment.likes || 0,
        initialPinned: comment.isPinned,
        user
    });

    return (
        <div className="relative">
            {isPinned && (
                <div className="flex items-center gap-2 mb-3">
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20">
                        <Pin className="w-3.5 h-3.5 text-primary" />
                        <span className="text-xs font-semibold text-primary">Sabitlenmiş</span>
                    </div>
                </div>
            )}

            <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-primary/20 transition-all duration-300 shadow-[var(--shadow-card)]">
                <div className="flex gap-4">
                    <div className="shrink-0">
                        <div className={cn(
                            "relative w-11 h-11 rounded-full overflow-hidden transition-all",
                            comment.role === "Admin"
                                ? "ring-2 ring-primary/60 shadow-[var(--shadow-primary-glow-xl)]"
                                : "ring-1 ring-white/10"
                        )}>
                            {comment.avatarUrl ? (
                                <Image src={getAvatarUrl(comment.avatarUrl)} alt={comment.author} fill className="object-cover" sizes="36px" />
                            ) : (
                                <div className={cn("w-full h-full flex items-center justify-center text-white font-semibold text-sm bg-white/10", comment.avatarColor)}>
                                    {comment.author[0].toUpperCase()}
                                </div>
                            )}
                        </div>
                    </div>

                    <div className="flex-1 min-w-0">
                        <CommentHeader
                            username={comment.username}
                            author={comment.author}
                            role={comment.role}
                            timeAgo={comment.timeAgo}
                            likes={comment.likes}
                        />

                        <div className="mb-3">
                            {comment.isSpoiler && !isSpoilerVisible ? (
                                <SpoilerContent content={comment.content} onReveal={() => onToggleSpoiler(comment.id)} />
                            ) : (
                                <p className="text-sm leading-relaxed text-white/70">{comment.content}</p>
                            )}
                        </div>

                        <CommentActions
                            liked={liked}
                            likeCount={likeCount}
                            isLiking={isLiking}
                            isPinned={isPinned}
                            isAdmin={!!isAdmin}
                            showReplyInput={showReplyInput}
                            onLike={handleLike}
                            onToggleReply={() => setShowReplyInput(!showReplyInput)}
                            onPin={handlePin}
                            repliesCount={comment.replies?.length}
                        />
                    </div>
                </div>

                {showReplyInput && (
                    <div className="relative mt-4 ml-14">
                        <div className="absolute -left-4 -top-4 w-4 h-8 border-l-2 border-b-2 border-primary/20 rounded-bl-lg" />
                        <CommentInput activeTab="comments" animeId={animeId} episodeId={episodeId} parentId={comment.id} onCommentAdded={() => { setShowReplyInput(false); onReplyAdded(); }} />
                    </div>
                )}

                {comment.replies && comment.replies.length > 0 && (
                    <div className="mt-4">
                        <RepliesList replies={comment.replies} parentId={comment.id} animeId={animeId} episodeId={episodeId} onReplyAdded={onReplyAdded} />
                    </div>
                )}
            </div>
        </div>
    );
}
