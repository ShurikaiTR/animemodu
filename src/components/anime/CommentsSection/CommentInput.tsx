"use client";

import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { createClient } from "@/lib/supabase/client";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { useAuth } from "@/contexts/AuthContext";
import ExistingReviewMessage from "./ExistingReviewMessage";
import ReviewFormHeader from "./ReviewFormHeader";
import LoginPrompt from "./LoginPrompt";
import CommentInputFooter from "./CommentInputFooter";

interface CommentInputProps {
    activeTab: "comments" | "reviews";
    animeId: number;
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
        if (error) {
            toast.error("Silme işlemi başarısız");
            return;
        }
        toast.success("İnceleme silindi");
        setHasExistingReview(false);
        setExistingReviewId(null);
        onCommentAdded();
    };

    if (!user) return <LoginPrompt compact={!!parentId} />;

    const handleSubmit = async () => {
        if (!content.trim()) return toast.error("Lütfen bir şeyler yazın");
        if (activeTab === "reviews" && rating === 0) return toast.error("Lütfen bir puan verin");
        setIsSubmitting(true);

        try {
            let error;
            if (activeTab === "comments") {
                const result = await supabase.from("comments").insert({
                    anime_id: animeId,
                    user_id: user.id,
                    content: content.trim(),
                    is_spoiler: isSpoiler,
                    episode_id: episodeId || null,
                    parent_id: parentId || null
                } as never);
                error = result.error;
            } else {
                const result = await supabase.from("reviews").insert({
                    anime_id: animeId,
                    user_id: user.id,
                    content: content.trim(),
                    is_spoiler: isSpoiler,
                    rating,
                    title: title.trim() || null
                } as never);
                error = result.error;
            }
            if (error) {
                if (error.code === "23505") {
                    toast.error("Bu anime için zaten bir inceleme yazmışsınız");
                    return;
                }
                throw new Error(error.message);
            }

            toast.success(activeTab === "comments" ? "Yorum gönderildi" : "İnceleme paylaşıldı");
            setContent("");
            setTitle("");
            setRating(0);
            setIsSpoiler(false);
            onCommentAdded();
        } catch (err) {
            const message = err instanceof Error ? err.message : "Bir hata oluştu";
            toast.error(message);
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
