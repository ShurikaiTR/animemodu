"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/errors";
import { requireUser, isAuthError } from "@/lib/auth/guards";
import { getImageUrl } from "@/lib/tmdb/utils";
import type { WatchStatus } from "@/types/supabase/tables/user-list";
import type { WatchListItemRaw, WatchListItem, WatchListResult } from "@/types/helpers";

/**
 * Fetches the complete watch list for the current authenticated user
 */
export async function getUserWatchList(userId: string): Promise<WatchListResult> {
    // Auth guard: Sadece kendi listesini görebilir
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    // Güvenlik kontrolü: userId auth.userId ile eşleşmeli
    if (auth.userId !== userId) {
        return { success: false, error: "Bu listeye erişim yetkiniz yok" };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("user_anime_list")
        .select(`
            *,
            anime:animes (
                id,
                title,
                slug,
                poster_path,
                vote_average,
                release_date,
                genres
            )
        `)
        .eq("user_id", userId)
        .order("updated_at", { ascending: false });

    if (error) {
        logError("getUserWatchList", error);
        return { success: false, error: error.message };
    }

    // Map database fields to frontend friendly names with proper types
    const mappedData: WatchListItem[] = (data as unknown as WatchListItemRaw[]).map((item) => ({
        id: item.id,
        user_id: item.user_id,
        anime_id: item.anime_id,
        status: item.status,
        score: item.score,
        created_at: item.created_at,
        updated_at: item.updated_at,
        anime: {
            id: item.anime.id,
            title: item.anime.title,
            slug: item.anime.slug,
            poster_url: getImageUrl(item.anime.poster_path, "w500"),
            score: item.anime.vote_average,
            release_year: item.anime.release_date
                ? new Date(item.anime.release_date).getFullYear()
                : 0,
            genres: item.anime.genres
        }
    }));

    return { success: true, data: mappedData };
}

/**
 * Updates or creates a watch status for an anime
 */
export async function updateWatchStatus(animeId: number, status: WatchStatus | null) {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    if (status === null) {
        // Remove from list
        const { error } = await supabase
            .from("user_anime_list")
            .delete()
            .eq("user_id", auth.userId)
            .eq("anime_id", animeId);

        if (error) {
            logError("updateWatchStatus.delete", error);
            return { success: false, error: error.message };
        }
    } else {
        // Upsert status - cast to bypass strict typing for dynamic table
        const { error } = await (supabase
            .from("user_anime_list") as ReturnType<typeof supabase.from>)
            .upsert({
                user_id: auth.userId,
                anime_id: animeId,
                status: status,
                updated_at: new Date().toISOString()
            } as Record<string, unknown>, {
                onConflict: "user_id, anime_id"
            });

        if (error) {
            logError("updateWatchStatus.upsert", error);
            return { success: false, error: error.message };
        }
    }

    revalidatePath("/profil", "layout");
    return { success: true };
}

/**
 * Check the watch status of an anime for the current user
 */
export async function checkWatchStatus(animeId: number) {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, status: null };
    }

    const supabase = await createClient();

    const { data } = await supabase
        .from("user_anime_list")
        .select("status")
        .eq("user_id", auth.userId)
        .eq("anime_id", animeId)
        .maybeSingle();

    return { success: true, status: data?.status || null };
}
