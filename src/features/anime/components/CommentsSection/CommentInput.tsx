"use client";

import { useCallback,useEffect, useState } from "react";
import { toast } from "sonner";

import { createCommentAction } from "@/features/comments/actions/comment-actions";
import { createReviewAction, deleteReviewAction, getUserReviewAction } from "@/features/reviews/actions/review-actions";
import { Textarea } from "@/shared/components/textarea";
import { useAuth } from "@/shared/contexts/AuthContext";
import { cn } from "@/shared/lib/utils";

import CommentInputFooter from "./CommentInputFooter";
import ExistingReviewMessage from "./ExistingReviewMessage";
import LoginPrompt from "./LoginPrompt";
import ReviewFormHeader from "./ReviewFormHeader";

interface CommentInputProps {
    activeTab: "comments" | "reviews";
    animeId: string;
    episodeId?: string;
    parentId?: string;
    onCommentAdded: () => void;
}

export default function CommentInput({ activeTab, animeId, episodeId, parentId, onCommentAdded }: CommentInputProps) {
    const { user } = useAuth();
    const [content, setContent] = useState("");
    const [title, setTitle] = useState("");
    const [rating, setRating] = useState(0);
    const [hoverRating, setHoverRating] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSpoiler, setIsSpoiler] = useState(false);
    const [hasExistingReview, setHasExistingReview] = useState(false);
    const [existingReviewId, setExistingReviewId] = useState<string | null>(null);

    const checkExistingReview = useCallback(async () => {
        if (!user || activeTab !== "reviews") return;
        const result = await getUserReviewAction(animeId);

        if (result.success && result.data) {
            setHasExistingReview(true);
            setExistingReviewId(result.data.id);
        } else {
            setHasExistingReview(false);
            setExistingReviewId(null);
        }
    }, [user, animeId, activeTab]);

    useEffect(() => {
        checkExistingReview();
    }, [checkExistingReview]);

    const handleDeleteReview = async () => {
        if (!existingReviewId) return;

        const result = await deleteReviewAction(existingReviewId);
        if (!result.success) {
            toast.error(result.error);
            return;
        }

        toast.success("İnceleme silindi");
        setHasExistingReview(false);
        setExistingReviewId(null);
        onCommentAdded();
    };

    if (!user) return <LoginPrompt compact={!!parentId} />;

    const handleSubmit = async () => {
        if (!content.trim()) return;
        if (activeTab === "reviews" && rating === 0) {
            toast.error("Lütfen bir puan verin");
            return;
        }
        setIsSubmitting(true);

        try {
            if (activeTab === "comments") {
                const result = await createCommentAction({
                    animeId,
                    episodeId,
                    parentId,
                    content: content.trim(),
                    isSpoiler
                });

                if (result.success) {
                    toast.success("Yorum gönderildi");
                    setContent("");
                    setIsSpoiler(false);
                    onCommentAdded();
                } else {
                    toast.error(result.error || "Yorum gönderilirken bir hata oluştu");
                }
            } else {
                const result = await createReviewAction({
                    animeId,
                    title: title.trim() || null,
                    content: content.trim(),
                    rating,
                    isSpoiler
                });

                if (result.success) {
                    toast.success("İnceleme paylaşıldı");
                    setContent("");
                    setTitle("");
                    setRating(0);
                    setIsSpoiler(false);
                    onCommentAdded();
                } else {
                    toast.error(result.error || "İnceleme paylaşılırken bir hata oluştu");
                }
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className={cn("relative", parentId ? "mt-2" : "mb-6")}>
            {activeTab === "reviews" && hasExistingReview && !parentId && (
                <ExistingReviewMessage onDelete={handleDeleteReview} />
            )}

            {(activeTab === "comments" || !hasExistingReview) && (
                <div className="rounded-xl bg-white/[0.02] border border-white/5 overflow-hidden transition-colors hover:border-primary/20 focus-within:border-primary/40">
                    {activeTab === "reviews" && !parentId && (
                        <ReviewFormHeader
                            title={title}
                            setTitle={setTitle}
                            rating={rating}
                            setRating={setRating}
                            hoverRating={hoverRating}
                            setHoverRating={setHoverRating}
                        />
                    )}

                    <Textarea
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        placeholder={parentId ? "Yanıtını yaz..." : (activeTab === "reviews" ? "Bu yapım hakkındaki düşüncelerini paylaş..." : "Düşüncelerini paylaş...")}
                        className="w-full bg-transparent border-none text-white placeholder:text-white/30 resize-none text-sm leading-relaxed p-4 focus-visible:ring-0 focus-visible:ring-offset-0 min-h-24"
                    />

                    <CommentInputFooter
                        isSpoiler={isSpoiler}
                        isSubmitting={isSubmitting}
                        hasContent={!!content.trim()}
                        onToggleSpoiler={() => setIsSpoiler(!isSpoiler)}
                        onSubmit={handleSubmit}
                    />
                </div>
            )}
        </div>
    );
}
