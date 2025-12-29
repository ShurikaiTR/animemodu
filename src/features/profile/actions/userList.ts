"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { logError } from "@/shared/lib/errors";
import { requireUser, isAuthError } from "@/shared/lib/auth/guards";
import { getImageUrl } from "@/shared/lib/tmdb/utils";
import type { WatchStatus } from "@/shared/types/domain/watchlist";
import type { WatchListResult } from "@/shared/types/helpers";

// Internal types
interface ListItem { anime_id: string; id: string; user_id: string; status: string; score: number | null; created_at: string; updated_at: string; }
interface AnimeData { id: string; title: string; slug: string; poster_path: string | null; vote_average: number | null; release_date: string | null; genres: string[] | null; }

/** Fetches the complete watch list for the current authenticated user */
export async function getUserWatchList(userId: string): Promise<WatchListResult> {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };
    if (auth.userId !== userId) return { success: false, error: "Bu listeye erişim yetkiniz yok" };

    const supabase = await createClient();
    const { data: listData, error: listError } = await supabase.from("user_anime_list").select("*").eq("user_id", userId).order("updated_at", { ascending: false });

    if (listError) { logError("getUserWatchList.list", listError); return { success: false, error: listError.message }; }
    if (!listData || listData.length === 0) return { success: true, data: [] };

    const animeIds = (listData as ListItem[]).map(item => item.anime_id);
    const { data: animesData, error: animesError } = await supabase.from("animes").select("id, title, slug, poster_path, vote_average, release_date, genres").in("id", animeIds);

    if (animesError) { logError("getUserWatchList.animes", animesError); return { success: false, error: animesError.message }; }

    const animesMap = new Map((animesData as AnimeData[]).map(a => [a.id, a]));
    const mappedData = (listData as ListItem[])
        .map((item) => {
            const anime = animesMap.get(item.anime_id);
            if (!anime) return null;
            return {
                id: item.id, user_id: item.user_id, anime_id: item.anime_id, status: item.status as WatchStatus,
                score: item.score, created_at: item.created_at, updated_at: item.updated_at,
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

/** Updates or creates a watch status for an anime */
export async function updateWatchStatus(animeId: string, status: WatchStatus | null) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    const supabase = await createClient();

    if (status === null) {
        const { error } = await supabase.from("user_anime_list").delete().eq("user_id", auth.userId).eq("anime_id", animeId);
        if (error) { logError("updateWatchStatus.delete", error); return { success: false, error: error.message }; }
    } else {
        const { error } = await (supabase.from("user_anime_list") as ReturnType<typeof supabase.from>)
            .upsert({ user_id: auth.userId, anime_id: animeId, status: status, updated_at: new Date().toISOString() } as Record<string, unknown>, { onConflict: "user_id, anime_id" });
        if (error) { logError("updateWatchStatus.upsert", error); return { success: false, error: error.message }; }
    }

    if (auth.username) revalidatePath(`/profil/${auth.username}`);
    return { success: true };
}

/** Check the watch status of an anime for the current user */
export async function checkWatchStatus(animeId: string) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, status: null };

    const supabase = await createClient();
    const { data } = await supabase.from("user_anime_list").select("status").eq("user_id", auth.userId).eq("anime_id", animeId).maybeSingle();
    return { success: true, status: (data as { status: string } | null)?.status || null };
}