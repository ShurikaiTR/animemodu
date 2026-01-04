"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin, requireUser } from "@/shared/lib/auth/guards";
import { formatZodError } from "@/shared/lib/validations/anime";

import { type CreateCommentInput,createCommentSchema } from "../schemas/comment-schemas";
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

        await CommentService.createComment({
            anime_id: animeId,
            episode_id: episodeId || null,
            parent_id: parentId || null,
            content,
            is_spoiler: isSpoiler,
            user_id: auth.userId,
        });

        revalidatePath(`/watch/${animeId}`); // Adjust path as needed
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

        return await CommentService.toggleLike(commentId, auth.userId);
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
