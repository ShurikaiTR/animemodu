"use server";

import { createClient } from "@/lib/supabase/server";
import { logError, getErrorMessage } from "@/lib/errors";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { revalidateAnimeData } from "@/lib/cache/revalidate";
import { animeIdSchema } from "@/lib/validations/anime";

type DeleteAnimeResult = { success: true } | { success: false; error: string };

export async function deleteAnime(id: number): Promise<DeleteAnimeResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = animeIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: "Geçersiz anime ID" };
    }

    const supabase = await createClient();

    try {
        // 2. Get associated comments and reviews to delete their likes first
        const { data: comments } = await supabase.from("comments").select("id").eq("anime_id", id);
        const { data: reviews } = await supabase.from("reviews").select("id").eq("anime_id", id);

        const commentIds = (comments as { id: number }[] | null)?.map(c => c.id) || [];
        const reviewIds = (reviews as { id: number }[] | null)?.map(r => r.id) || [];

        // 3. Delete likes associated with comments and reviews
        if (commentIds.length > 0) {
            await supabase.from("comment_likes").delete().in("comment_id", commentIds);
        }
        if (reviewIds.length > 0) {
            await supabase.from("review_likes").delete().in("review_id", reviewIds);
        }

        // 4. Delete comments, reviews and episodes
        await supabase.from("comments").delete().eq("anime_id", id);
        await supabase.from("reviews").delete().eq("anime_id", id);
        await supabase.from("episodes").delete().eq("anime_id", id);

        // 5. Finally delete the anime
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
