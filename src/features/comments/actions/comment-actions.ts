"use server";

import { revalidatePath } from "next/cache";

import { NotificationService } from "@/features/notifications/services/notification-service";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin, requireUser } from "@/shared/lib/auth/guards";
import { createClient } from "@/shared/lib/supabase/server";
import { formatZodError } from "@/shared/lib/validations/anime";

import { type CreateCommentInput, createCommentSchema } from "../schemas/comment-schemas";
import { CommentService } from "../services/comment-service";

/**
 * Fetch comments for an anime or episode
 */
export async function getCommentsAction(animeId: string, episodeId?: string) {
    return await safeAction(async () => {
        return await CommentService.getComments(animeId, episodeId);
    }, "getComments");
}

/**
 * Create a new comment
 */
export async function createCommentAction(data: CreateCommentInput) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const validation = createCommentSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const { animeId, episodeId, parentId, content, isSpoiler } = validation.data;

        const createdComment = await CommentService.createComment({
            anime_id: animeId,
            episode_id: episodeId || null,
            parent_id: parentId || null,
            content,
            is_spoiler: isSpoiler,
            user_id: auth.userId,
        });

        // Eğer bu bir yanıt ise, orijinal yorum sahibine bildirim gönder
        if (parentId) {
            const supabase = await createClient();
            const { data: parentComment } = await supabase
                .from("comments")
                .select("user_id, anime_id")
                .eq("id", parentId)
                .single();

            // Kendisine yanıt verdiyse bildirim gönderme
            if (parentComment && parentComment.user_id !== auth.userId) {
                const { data: anime } = await supabase
                    .from("animes")
                    .select("title, slug")
                    .eq("id", parentComment.anime_id)
                    .single();

                await NotificationService.createNotification({
                    userId: parentComment.user_id,
                    type: "comment_reply",
                    title: "yorumuna yanıt verdi",
                    message: content.substring(0, 100) + (content.length > 100 ? "..." : ""),
                    link: anime ? `/anime/${anime.slug}#comments` : undefined,
                    animeId: parentComment.anime_id,
                    actorId: auth.userId,
                });
            }
        }

        revalidatePath(`/watch/${animeId}`);
        return createdComment;
    }, "createComment");
}

/**
 * Update a comment
 */
export async function updateCommentAction(id: string, content: string, isSpoiler?: boolean) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        await CommentService.updateComment(id, auth.userId, content, isSpoiler);
    }, "updateComment");
}

/**
 * Delete a comment
 */
export async function deleteCommentAction(id: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const isAdmin = auth.role === "admin";
        await CommentService.deleteComment(id, auth.userId, isAdmin);

        revalidatePath("/panel/comments");
    }, "deleteComment");
}

/**
 * Toggle like
 */
export async function toggleCommentLikeAction(commentId: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) throw new Error(auth.error);

        const result = await CommentService.toggleLike(commentId, auth.userId);

        // Beğeni eklendiyse, yorum sahibine bildirim gönder
        if (result.liked) {
            const supabase = await createClient();
            const { data: comment } = await supabase
                .from("comments")
                .select("user_id, anime_id, content")
                .eq("id", commentId)
                .single();

            // Kendi yorumunu beğendiyse bildirim gönderme
            if (comment && comment.user_id !== auth.userId) {
                const { data: anime } = await supabase
                    .from("animes")
                    .select("title, slug")
                    .eq("id", comment.anime_id)
                    .single();

                await NotificationService.createNotification({
                    userId: comment.user_id,
                    type: "comment_like",
                    title: "yorumunu beğendi",
                    message: comment.content.substring(0, 50) + (comment.content.length > 50 ? "..." : ""),
                    link: anime ? `/anime/${anime.slug}#comments` : undefined,
                    animeId: comment.anime_id,
                    actorId: auth.userId,
                });
            }
        }

        return result;
    }, "toggleLike");
}

/**
 * Toggle pin (Admin only)
 */
export async function toggleCommentPinAction(commentId: string) {
    return await safeAction(async () => {
        const auth = await requireAdmin();
        if (isAuthError(auth)) throw new Error(auth.error);

        return await CommentService.togglePin(commentId);
    }, "togglePin");
}

/**
 * Check if user liked
 */
export async function checkUserLikedCommentAction(commentId: string) {
    return await safeAction(async () => {
        const auth = await requireUser();
        if (isAuthError(auth)) return false;

        return await CommentService.checkUserLiked(commentId, auth.userId);
    }, "checkUserLiked");
}
