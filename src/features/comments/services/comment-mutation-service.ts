import { createClient } from "@/shared/lib/supabase/server";
import type { CommentInsert, CommentRow } from "@/shared/types/helpers";

export class CommentMutationService {
    /**
     * Create a new comment
     */
    static async createComment(data: CommentInsert): Promise<CommentRow> {
        const supabase = await createClient();
        const { data: comment, error } = await supabase
            .from("comments")
            .insert(data)
            .select()
            .single();

        if (error) throw new Error(error.message);
        return comment;
    }

    /**
     * Update a comment
     */
    static async updateComment(id: string, userId: string, content: string, isSpoiler?: boolean): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("comments")
            .update({
                content,
                is_spoiler: isSpoiler,
                updated_at: new Date().toISOString()
            })
            .eq("id", id)
            .eq("user_id", userId);

        if (error) throw new Error(error.message);
    }

    /**
     * Delete a comment
     */
    static async deleteComment(id: string, userId: string, isAdmin = false): Promise<void> {
        const supabase = await createClient();
        let query = supabase.from("comments").delete().eq("id", id);

        if (!isAdmin) {
            query = query.eq("user_id", userId);
        }

        const { error } = await query;
        if (error) throw new Error(error.message);
    }

    /**
     * Toggle comment like
     */
    static async toggleLike(commentId: string, userId: string): Promise<{ liked: boolean }> {
        const supabase = await createClient();

        const { data: existingLike } = await supabase
            .from("comment_likes")
            .select("id")
            .eq("comment_id", commentId)
            .eq("user_id", userId)
            .maybeSingle();

        if (existingLike) {
            const { error } = await supabase
                .from("comment_likes")
                .delete()
                .eq("comment_id", commentId)
                .eq("user_id", userId);

            if (error) throw new Error(error.message);
            return { liked: false };
        } else {
            const { error } = await supabase
                .from("comment_likes")
                .insert({ comment_id: commentId, user_id: userId });

            if (error) throw new Error(error.message);
            return { liked: true };
        }
    }

    /**
     * Toggle pin (Admin only)
     */
    static async togglePin(commentId: string): Promise<boolean> {
        const supabase = await createClient();

        const { data: comment } = await supabase
            .from("comments")
            .select("is_pinned")
            .eq("id", commentId)
            .single();

        const newPinned = !comment?.is_pinned;
        const { error } = await supabase
            .from("comments")
            .update({ is_pinned: newPinned })
            .eq("id", commentId);

        if (error) throw new Error(error.message);
        return newPinned;
    }

    /**
     * Check if user liked a comment
     */
    static async checkUserLiked(commentId: string, userId: string): Promise<boolean> {
        const supabase = await createClient();
        const { data } = await supabase
            .from("comment_likes")
            .select("id")
            .eq("comment_id", commentId)
            .eq("user_id", userId)
            .maybeSingle();

        return !!data;
    }
}
