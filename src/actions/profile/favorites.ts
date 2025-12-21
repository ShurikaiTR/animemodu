"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logError } from "@/lib/errors";
import { requireUser, isAuthError } from "@/lib/auth/guards";
import { getImageUrl } from "@/lib/tmdb/utils";
import type { FavoriteItem, UserFavoritesWithAnime } from "@/types/helpers";

/**
 * Toggles favorite status for an anime (independent from watchlist)
 */
export async function toggleFavorite(animeId: number) {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    const supabase = await createClient();

    // Check if already favorite
    const { data: existing } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", auth.userId)
        .eq("anime_id", animeId)
        .maybeSingle();

    if (existing) {
        // Remove from favorites
        const { error } = await supabase
            .from("user_favorites")
            .delete()
            .eq("user_id", auth.userId)
            .eq("anime_id", animeId);

        if (error) {
            logError("toggleFavorite.delete", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/profil", "layout");
        return { success: true, isFavorite: false };
    } else {
        // Add to favorites
        const { error } = await supabase
            .from("user_favorites")
            .insert({
                user_id: auth.userId,
                anime_id: animeId
            } as never);

        if (error) {
            logError("toggleFavorite.insert", error);
            return { success: false, error: error.message };
        }

        revalidatePath("/profil", "layout");
        return { success: true, isFavorite: true };
    }
}

/**
 * Check if an anime is in user's favorites
 */
export async function checkFavorite(animeId: number) {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, isFavorite: false };
    }

    const supabase = await createClient();

    const { data } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", auth.userId)
        .eq("anime_id", animeId)
        .maybeSingle();

    return { success: true, isFavorite: !!data };
}

/**
 * Get user's favorite animes
 */
export async function getUserFavorites(userId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error, data: [] };
    }

    if (auth.userId !== userId) {
        return { success: false, error: "Bu listeye erişim yetkiniz yok", data: [] };
    }

    const supabase = await createClient();

    const { data, error } = await supabase
        .from("user_favorites")
        .select(`
            id,
            anime_id,
            created_at,
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
        .order("created_at", { ascending: false });

    if (error) {
        logError("getUserFavorites", error);
        return { success: false, error: error.message, data: [] };
    }

    const mappedData: FavoriteItem[] = (data || []).map((item) => {
        const typedItem = item as unknown as UserFavoritesWithAnime;
        return {
            id: typedItem.id,
            user_id: userId,
            anime_id: typedItem.anime_id,
            created_at: typedItem.created_at,
            anime: {
                id: typedItem.anime.id,
                title: typedItem.anime.title,
                slug: typedItem.anime.slug,
                poster_url: getImageUrl(typedItem.anime.poster_path, "w500"),
                score: typedItem.anime.vote_average,
                release_year: typedItem.anime.release_date
                    ? new Date(typedItem.anime.release_date).getFullYear()
                    : 0,
                genres: typedItem.anime.genres
            }
        };
    });

    return { success: true, data: mappedData };
}
