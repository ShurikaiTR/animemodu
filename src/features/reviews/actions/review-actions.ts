"use server";

import { revalidatePath } from "next/cache";

import { NotificationMutationService } from "@/features/notifications/services/notification-mutation-service";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireUser } from "@/shared/lib/auth/guards";
import { createClient } from "@/shared/lib/supabase/server";
import { formatZodError } from "@/shared/lib/validations/anime";

import { type CreateReviewInput, createReviewSchema } from "../schemas/review-schemas";
import { ReviewMutationService } from "../services/review-mutation-service";
import { ReviewQueryService } from "../services/review-query-service";

/**
 * Fetch reviews for an anime
 */
export async function getReviewsAction(animeId: string) {
    return await safeAction(async () => {
        return await ReviewQueryService.getReviews(animeId);
    }, "getReviews");
}

/**
 * Get current user's review
 */
export async function getUserReviewAction(animeId: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) return null;

        return await ReviewQueryService.getUserReview(animeId, auth.userId);
    }, "getUserReview");
}

/**
 * Create a review
 */
export async function createReviewAction(data: CreateReviewInput) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const validation = createReviewSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const { animeId, title, content, rating, isSpoiler } = validation.data;

        await ReviewMutationService.createReview({
            anime_id: animeId,
            user_id: auth.userId,
            title: title || null,
            content,
            rating,
            is_spoiler: isSpoiler,
        });

        revalidatePath(`/anime/${animeId}`);
    }, "createReview");
}

/**
 * Delete a review
 */
export async function deleteReviewAction(id: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const isAdmin = auth.role === "admin";
        await ReviewMutationService.deleteReview(id, auth.userId, isAdmin);

        revalidatePath("/panel/comments");
        revalidatePath("/"); // Home page might have lists
    }, "deleteReview");
}

/**
 * Toggle like (helpful)
 */
export async function toggleReviewLikeAction(reviewId: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const result = await ReviewMutationService.toggleLike(reviewId, auth.userId);

        // Beğeni eklendiyse, inceleme sahibine bildirim gönder
        if (result.liked) {
            const supabase = await createClient();
            const { data: review } = await supabase
                .from("reviews")
                .select("user_id, anime_id, title, content")
                .eq("id", reviewId)
                .single();

            // Kendi incelemesini beğendiyse bildirim gönderme
            if (review && review.user_id !== auth.userId) {
                const { data: anime } = await supabase
                    .from("animes")
                    .select("title, slug")
                    .eq("id", review.anime_id)
                    .single();

                await NotificationMutationService.createNotification({
                    userId: review.user_id,
                    type: "review_like",
                    title: "incelemeni beğendi",
                    message: review.title || review.content.substring(0, 50) + "...",
                    link: anime ? `/anime/${anime.slug}#reviews` : undefined,
                    animeId: review.anime_id,
                    actorId: auth.userId,
                });
            }
        }

        return result;
    }, "toggleReviewLike");
}

/**
 * Check if user liked
 */
export async function checkUserLikedReviewAction(reviewId: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) return false;

        return await ReviewMutationService.checkUserLiked(reviewId, auth.userId);
    }, "checkUserLikedReview");
}
