"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidateProfileData } from "@/shared/lib/cache/revalidate";
import { logError } from "@/shared/lib/errors";
import { requireUser, isAuthError } from "@/shared/lib/auth/guards";
import { getImageUrl } from "@/shared/lib/tmdb/utils";

// Internal types
interface FavItem { id: string; anime_id: string; created_at: string; }
interface AnimeData { id: string; title: string; slug: string; poster_path: string | null; vote_average: number | null; release_date: string | null; genres: string[] | null; }

/** Toggles favorite status for an anime */
export async function toggleFavorite(animeId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    const supabase = await createClient();

    const { data: existing } = await supabase
        .from("user_favorites")
        .select("id")
        .eq("user_id", auth.userId)
        .eq("anime_id", animeId)
        .maybeSingle();

    if (existing) {
        const { error } = await supabase.from("user_favorites").delete().eq("user_id", auth.userId).eq("anime_id", animeId);
        if (error) { logError("toggleFavorite.delete", error); return { success: false, error: error.message }; }
        if (auth.username) revalidateProfileData(auth.username);
        return { success: true, isFavorite: false };
    } else {
        const { error } = await supabase.from("user_favorites").insert({ user_id: auth.userId, anime_id: animeId });
        if (error) { logError("toggleFavorite.insert", error); return { success: false, error: error.message }; }
        if (auth.username) revalidateProfileData(auth.username);
        return { success: true, isFavorite: true };
    }
}

/** Check if an anime is in user's favorites */
export async function checkFavorite(animeId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, isFavorite: false };

    const supabase = await createClient();
    const { data } = await supabase.from("user_favorites").select("id").eq("user_id", auth.userId).eq("anime_id", animeId).maybeSingle();
    return { success: true, isFavorite: !!data };
}

/** Get user's favorite animes */
export async function getUserFavorites(userId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error, data: [] };
    if (auth.userId !== userId) return { success: false, error: "Bu listeye erişim yetkiniz yok", data: [] };

    const supabase = await createClient();
    const { data: favData, error: favError } = await supabase.from("user_favorites").select("id, anime_id, created_at").eq("user_id", userId).order("created_at", { ascending: false });

    if (favError) { logError("getUserFavorites.list", favError.message || favError); return { success: false, error: favError.message || "Favoriler alınamadı", data: [] }; }
    if (!favData || favData.length === 0) return { success: true, data: [] };

    const animeIds = (favData as FavItem[]).map(item => item.anime_id);
    const { data: animesData, error: animesError } = await supabase.from("animes").select("id, title, slug, poster_path, vote_average, release_date, genres").in("id", animeIds);

    if (animesError) { logError("getUserFavorites.animes", animesError.message || animesError); return { success: false, error: animesError.message || "Anime bilgileri alınamadı", data: [] }; }

    const animesMap = new Map((animesData as AnimeData[]).map(a => [a.id, a]));
    const mappedData = (favData as FavItem[])
        .map((item) => {
            const anime = animesMap.get(item.anime_id);
            if (!anime) return null;
            return {
                id: item.id, user_id: userId, anime_id: item.anime_id, created_at: item.created_at,
                anime: {
                    id: anime.id, title: anime.title, slug: anime.slug,
                    poster_url: getImageUrl(anime.poster_path, "w500") || "",
                    score: anime.vote_average,
                    release_year: anime.release_date ? new Date(anime.release_date).getFullYear() : 0,
                    genres: anime.genres
                }
            };
        })
        .filter((item): item is NonNullable<typeof item> => item !== null);

    return { success: true, data: mappedData };
}
