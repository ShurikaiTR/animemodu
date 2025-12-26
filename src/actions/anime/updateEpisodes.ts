"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnimeDetails, getSeasonDetails } from "@/lib/tmdb/details";
import type { TMDBSeriesData } from "@/types/helpers";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { revalidateEpisodeData } from "@/lib/cache/revalidate";
import { animeIdSchema } from "@/lib/validations/anime";
import { mapTMDBEpisodesToDB, type EpisodeInsertData } from "./episodeHelpers";

type UpdateEpisodesResult = { success: true; addedCount: number } | { success: false; error: string };
type AnimeEpData = { tmdb_id: number; media_type: string | null; structure_type: string | null };

export async function updateEpisodes(animeId: string): Promise<UpdateEpisodesResult> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    const validation = animeIdSchema.safeParse(animeId);
    if (!validation.success) return { success: false, error: "Geçersiz anime UUID" };

    const supabase = await createClient();

    const { data: anime, error: animeError } = await supabase
        .from("animes")
        .select("tmdb_id, media_type, structure_type")
        .eq("id", animeId)
        .single();

    if (animeError || !anime) return { success: false, error: "Anime bulunamadı." };

    if ((anime as AnimeEpData).media_type !== "tv") {
        return { success: false, error: "Bu işlem sadece TV dizileri için geçerlidir." };
    }

    const { data: existingEpisodes } = await supabase
        .from("episodes")
        .select("tmdb_id")
        .eq("anime_id", animeId);

    const existingTmdbIds = new Set((existingEpisodes as { tmdb_id: number }[] | null)?.map(ep => ep.tmdb_id) || []);

    const details = await getAnimeDetails((anime as AnimeEpData).tmdb_id, "tv");
    if (!details || !details.number_of_seasons) {
        return { success: false, error: "TMDB'den anime detayları alınamadı." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAbsolute = (anime as AnimeEpData).structure_type === "absolute";
    const absoluteCounter = { value: 1 };

    if (isAbsolute) {
        const { data: maxEp } = await supabase
            .from("episodes")
            .select("absolute_episode_number")
            .eq("anime_id", animeId)
            .order("absolute_episode_number", { ascending: false })
            .limit(1)
            .single();

        if ((maxEp as { absolute_episode_number: number | null } | null)?.absolute_episode_number) {
            absoluteCounter.value = ((maxEp as unknown) as { absolute_episode_number: number }).absolute_episode_number + 1;
        }
    }

    let newEpisodesToInsert: EpisodeInsertData[] = [];

    // Parallel fetch all seasons for better performance
    const seasonPromises = Array.from(
        { length: details.number_of_seasons },
        (_, i) => getSeasonDetails((anime as AnimeEpData).tmdb_id, i + 1)
    );
    const allSeasons = await Promise.all(seasonPromises);

    for (const seasonData of allSeasons) {
        if (seasonData) {
            const mapped = mapTMDBEpisodesToDB(seasonData as TMDBSeriesData, {
                animeId,
                isAbsolute,
                existingTmdbIds,
                today,
                absoluteCounter
            });
            newEpisodesToInsert = [...newEpisodesToInsert, ...mapped];
        }
    }

    if (newEpisodesToInsert.length > 0) {
        const { error: epError } = await supabase
            .from("episodes")
            .insert(newEpisodesToInsert as never);

        if (epError) return { success: false, error: "Bölüm ekleme hatası: " + epError.message };
    }

    revalidateEpisodeData();
    return { success: true, addedCount: newEpisodesToInsert.length };
}
