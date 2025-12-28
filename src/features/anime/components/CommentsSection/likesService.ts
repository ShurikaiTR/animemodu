import { createClient } from "@/shared/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

const supabase = createClient();

export async function toggleCommentLike(commentId: string, user: User | null): Promise<{ liked: boolean; error: string | null }> {
    if (!user) {
        return { liked: false, error: "Beğenmek için giriş yapmalısınız" };
    }

    const { data: existingLike } = await supabase
        .from("comment_likes")
        .select("id")
        .eq("comment_id", commentId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingLike) {
        const { error } = await supabase
            .from("comment_likes")
            .delete()
            .eq("comment_id", commentId)
            .eq("user_id", user.id);

        if (error) return { liked: true, error: error.message };
        return { liked: false, error: null };
    } else {
        const { error } = await supabase
            .from("comment_likes")
            .insert({ comment_id: commentId, user_id: user.id });

        if (error) return { liked: false, error: error.message };
        return { liked: true, error: null };
    }
}

export async function toggleReviewLike(reviewId: string, user: User | null): Promise<{ liked: boolean; error: string | null }> {
    if (!user) {
        return { liked: false, error: "Beğenmek için giriş yapmalısınız" };
    }

    const { data: existingLike } = await supabase
        .from("review_likes")
        .select("id")
        .eq("review_id", reviewId)
        .eq("user_id", user.id)
        .maybeSingle();

    if (existingLike) {
        const { error } = await supabase
            .from("review_likes")
            .delete()
            .eq("review_id", reviewId)
            .eq("user_id", user.id);

        if (error) return { liked: true, error: error.message };
        return { liked: false, error: null };
    } else {
        const { error } = await supabase
            .from("review_likes")
            .insert({ review_id: reviewId, user_id: user.id });

        if (error) return { liked: false, error: error.message };
        return { liked: true, error: null };
    }
}

export async function checkUserLikedComment(commentId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from("comment_likes")
        .select("id")
        .eq("comment_id", commentId)
        .eq("user_id", userId)
        .maybeSingle();

    return !!data;
}

export async function checkUserLikedReview(reviewId: string, userId: string): Promise<boolean> {
    const { data } = await supabase
        .from("review_likes")
        .select("id")
        .eq("review_id", reviewId)
        .eq("user_id", userId)
        .maybeSingle();

    return !!data;
}
