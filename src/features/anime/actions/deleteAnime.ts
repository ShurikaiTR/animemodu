"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { logError, getErrorMessage } from "@/shared/lib/errors";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { revalidateAnimeData } from "@/shared/lib/cache/revalidate";
import { animeIdSchema } from "@/shared/lib/validations/anime";

type DeleteAnimeResult = { success: true } | { success: false; error: string };

export async function deleteAnime(id: string): Promise<DeleteAnimeResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = animeIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: "Geçersiz anime UUID" };
    }

    const supabase = await createClient();

    try {
        // 1. Parallel fetch comments and reviews to get their IDs for likes deletion
        const [{ data: comments }, { data: reviews }] = await Promise.all([
            supabase.from("comments").select("id").eq("anime_id", id),
            supabase.from("reviews").select("id").eq("anime_id", id)
        ]);

        const commentIds = (comments as { id: string }[] | null)?.map(c => c.id) || [];
        const reviewIds = (reviews as { id: string }[] | null)?.map(r => r.id) || [];

        // 2. Parallel delete likes (must happen before comments/reviews due to FK)
        await Promise.all([
            commentIds.length > 0 ? supabase.from("comment_likes").delete().in("comment_id", commentIds) : Promise.resolve(),
            reviewIds.length > 0 ? supabase.from("review_likes").delete().in("review_id", reviewIds) : Promise.resolve()
        ]);

        // 3. Parallel delete comments, reviews and episodes (CASCADE handles rest, but explicit is safer)
        await Promise.all([
            supabase.from("comments").delete().eq("anime_id", id),
            supabase.from("reviews").delete().eq("anime_id", id),
            supabase.from("episodes").delete().eq("anime_id", id)
        ]);

        // 4. Finally delete the anime
        const { data: deletedAnime, error } = await supabase.from("animes").delete().eq("id", id).select();

        if (error) throw error;

        if (!deletedAnime || deletedAnime.length === 0) {
            throw new Error("Silme işlemi gerçekleşmedi (Yetki sorunu veya kayıt bulunamadı).");
        }

        // Revalidate all anime-related cache
        revalidateAnimeData();

        return { success: true };
    } catch (error) {
        logError("deleteAnime", error);
        return { success: false, error: getErrorMessage(error, "Silme işlemi sırasında bir hata oluştu.") };
    }
}
