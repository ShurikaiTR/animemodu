"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Star, ThumbsUp, ShieldCheck, Quote } from "lucide-react";
import { cn, getAvatarUrl } from "@/lib/utils";
import type { Review } from "./types";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";
import { toggleReviewLike, checkUserLikedReview } from "./likesService";
import { Badge } from "@/components/ui/badge";

interface ReviewCardProps {
    review: Review;
}

export default function ReviewCard({ review }: ReviewCardProps) {
    const { user } = useAuth();
    const [isExpanded, setIsExpanded] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(review.helpfulCount || 0);
    const [isLiking, setIsLiking] = useState(false);

    useEffect(() => {
        if (user) {
            checkUserLikedReview(review.id, user.id).then(setLiked);
        }
    }, [user, review.id]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Beğenmek için giriş yapmalısınız");
            return;
        }
        if (isLiking) return;

        setIsLiking(true);
        const { liked: newLiked, error } = await toggleReviewLike(review.id, user);
        setIsLiking(false);

        if (error) {
            toast.error(error);
            return;
        }

        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    };

    return (
        <div className="p-5 rounded-2xl bg-gradient-to-br from-white/[0.04] to-white/[0.01] border border-white/[0.06] hover:border-primary/20 transition-all duration-300 shadow-[var(--shadow-card)]">
            <div className="flex gap-4">
                <div className="shrink-0">
                    <div className={cn(
                        "relative w-12 h-12 rounded-full overflow-hidden transition-all",
                        review.role === "Admin"
                            ? "ring-2 ring-primary/60 shadow-[var(--shadow-primary-glow-xl)]"
                            : "ring-1 ring-white/10"
                    )}>
                        {review.avatarUrl ? (
                            <Image src={getAvatarUrl(review.avatarUrl)} alt={review.author} fill className="object-cover" sizes="36px" />
                        ) : (
                            <div className={cn("w-full h-full flex items-center justify-center text-white font-semibold bg-white/10", review.avatarColor)}>
                                {review.author.charAt(0).toUpperCase()}
                            </div>
                        )}
                    </div>
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-3">
                        <div>
                            <div className="flex items-center gap-2 mb-1">
                                <span className={cn("font-semibold text-sm", review.role === "Admin" ? "text-primary" : "text-white/90")}>{review.author}</span>
                                {review.role === "Admin" && (
                                    <Badge variant="blue" className="px-2 py-0.5 font-bold rounded-full text-[10px] flex items-center gap-1">
                                        <ShieldCheck className="w-3 h-3" />
                                        Yönetici
                                    </Badge>
                                )}
                                <span className="text-white/30 text-xs">{review.timeAgo}</span>
                            </div>
                            {review.title && <h4 className="text-base font-semibold text-white line-clamp-1">{review.title}</h4>}
                        </div>

                        <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-gradient-to-r from-primary/15 to-primary/5 border border-primary/20">
                            <Star className="w-5 h-5 text-primary fill-primary drop-shadow-[var(--shadow-primary-glow-sm)]" />
                            <span className="text-lg font-bold text-white tabular-nums">{review.rating}</span>
                            <span className="text-xs text-white/40">/10</span>
                        </div>
                    </div>

                    <div className="relative mb-4">
                        <Quote className="absolute left-0 -top-1 w-5 h-5 text-white/10" />
                        <div className={cn("relative transition-all", !isExpanded && review.content.length > 300 && "max-h-[100px] overflow-hidden")}>
                            <p className="text-sm leading-relaxed text-white/70 pl-7">{review.content}</p>
                            {!isExpanded && review.content.length > 300 && (
                                <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-bg-main to-transparent" />
                            )}
                        </div>
                        {review.content.length > 300 && (
                            <button onClick={() => setIsExpanded(!isExpanded)} className="mt-2 text-xs font-medium text-primary hover:text-primary/80 transition-colors pl-7">
                                {isExpanded ? "Daha az göster" : "Devamını oku"}
                            </button>
                        )}
                    </div>

                    <div className="flex items-center gap-1">
                        <button onClick={handleLike} disabled={isLiking} className={cn("flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium transition-all", liked ? "text-primary bg-primary/10" : "text-white/40 hover:text-primary hover:bg-white/5", isLiking && "opacity-50 cursor-not-allowed")}>
                            <ThumbsUp className={cn("w-4 h-4", liked && "fill-current")} />
                            {likeCount} kişi yararlı buldu
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
