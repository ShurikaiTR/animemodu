import { toast } from "sonner";
import type { SupabaseClient } from "@supabase/supabase-js";

interface SubmitCommentData {
    supabase: SupabaseClient;
    animeId: string;
    userId: string;
    content: string;
    isSpoiler: boolean;
    episodeId?: string;
    parentId?: string;
}

interface SubmitReviewData {
    supabase: SupabaseClient;
    animeId: string;
    userId: string;
    content: string;
    isSpoiler: boolean;
    rating: number;
    title: string;
}

export async function submitComment(data: SubmitCommentData): Promise<boolean> {
    const { supabase, animeId, userId, content, isSpoiler, episodeId, parentId } = data;

    const { error } = await supabase.from("comments").insert({
        anime_id: animeId,
        user_id: userId,
        content: content.trim(),
        is_spoiler: isSpoiler,
        episode_id: episodeId || null,
        parent_id: parentId || null
    } as never);

    if (error) {
        toast.error("Yorum gönderilirken bir hata oluştu");
        return false;
    }

    toast.success("Yorum gönderildi");
    return true;
}

export async function submitReview(data: SubmitReviewData): Promise<boolean> {
    const { supabase, animeId, userId, content, isSpoiler, rating, title } = data;

    const { error } = await supabase.from("reviews").insert({
        anime_id: animeId,
        user_id: userId,
        content: content.trim(),
        is_spoiler: isSpoiler,
        rating,
        title: title.trim() || null
    } as never);

    if (error) {
        if (error.code === "23505") {
            toast.error("Bu anime için zaten bir inceleme yazmışsınız");
        } else {
            toast.error("İnceleme paylaşılırken bir hata oluştu");
        }
        return false;
    }

    toast.success("İnceleme paylaşıldı");
    return true;
}
