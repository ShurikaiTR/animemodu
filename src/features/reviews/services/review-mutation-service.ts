import { createClient } from "@/shared/lib/supabase/server";
import type { ReviewInsert, ReviewRow } from "@/shared/types/helpers";

export class ReviewMutationService {
    /**
     * Create a review
     */
    static async createReview(data: ReviewInsert): Promise<ReviewRow> {
        const supabase = await createClient();
        const { data: review, error } = await supabase
            .from("reviews")
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return review;
    }

    /**
     * Delete a review
     */
    static async deleteReview(id: string, userId: string, isAdmin = false): Promise<void> {
        const supabase = await createClient();
        let query = supabase.from("reviews").delete().eq("id", id);

        if (!isAdmin) {
            query = query.eq("user_id", userId);
        }

        const { error } = await query;
        if (error) throw new Error(error.message);
    }

    /**
     * Toggle review like (helpful)
     */
    static async toggleLike(reviewId: string, userId: string): Promise<{ liked: boolean }> {
        const supabase = await createClient();

        const { data: existingLike } = await supabase
            .from("review_likes")
            .select("id")
            .eq("review_id", reviewId)
            .eq("user_id", userId)
            .maybeSingle();

        if (existingLike) {
            const { error } = await supabase
                .from("review_likes")
                .delete()
                .eq("review_id", reviewId)
                .eq("user_id", userId);

            if (error) throw new Error(error.message);
            return { liked: false };
        } else {
            const { error } = await supabase
                .from("review_likes")
                .insert({ review_id: reviewId, user_id: userId });

            if (error) throw new Error(error.message);
            return { liked: true };
        }
    }

    /**
     * Check if user liked a review
     */
    static async checkUserLiked(reviewId: string, userId: string): Promise<boolean> {
        const supabase = await createClient();
        const { data } = await supabase
            .from("review_likes")
            .select("id")
            .eq("review_id", reviewId)
            .eq("user_id", userId)
            .maybeSingle();

        return !!data;
    }
}
