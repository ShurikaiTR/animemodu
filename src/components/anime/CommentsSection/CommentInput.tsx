"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ExistingReviewMessage from "./ExistingReviewMessage";
import ReviewFormHeader from "./ReviewFormHeader";
import LoginPrompt from "./LoginPrompt";
import CommentInputFooter from "./CommentInputFooter";
import { submitComment, submitReview } from "./submitHelpers";

interface CommentInputProps {
    activeTab: "comments" | "reviews";
    animeId: string;
    episodeId?: number;
    parentId?: number;
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
    const [existingReviewId, setExistingReviewId] = useState<number | null>(null);
    const supabase = createClient();

    useEffect(() => {
        async function checkExistingReview() {
            if (!user || activeTab !== "reviews") return;
            const { data } = await supabase
                .from("reviews")
                .select("id")
                .eq("anime_id", animeId)
                .eq("user_id", user.id)
                .single();

            if (data) {
                setHasExistingReview(true);
                setExistingReviewId((data as { id: number } | null)?.id ?? null);
            } else {
                setHasExistingReview(false);
                setExistingReviewId(null);
            }
        }
        checkExistingReview();
    }, [user, animeId, activeTab, supabase]);

    const handleDeleteReview = async () => {
        if (!existingReviewId) return;
        const { error } = await supabase.from("reviews").delete().eq("id", existingReviewId);
        if (error) return;
        setHasExistingReview(false);
        setExistingReviewId(null);
        onCommentAdded();
    };

    if (!user) return <LoginPrompt compact={!!parentId} />;

    const handleSubmit = async () => {
        if (!content.trim()) return;
        if (activeTab === "reviews" && rating === 0) return;
        setIsSubmitting(true);

        try {
            let success = false;
            if (activeTab === "comments") {
                success = await submitComment({
                    supabase, animeId, userId: user.id, content, isSpoiler, episodeId, parentId
                });
            } else {
                success = await submitReview({
                    supabase, animeId, userId: user.id, content, isSpoiler, rating, title
                });
            }

            if (success) {
                setContent("");
                setTitle("");
                setRating(0);
                setIsSpoiler(false);
                onCommentAdded();
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
