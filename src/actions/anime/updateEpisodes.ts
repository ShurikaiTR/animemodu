"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnimeDetails, getSeasonDetails } from "@/lib/tmdb/details";
import type { TMDBSeriesData } from "@/types/helpers";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { revalidateEpisodeData } from "@/lib/cache/revalidate";
import { animeIdSchema } from "@/lib/validations/anime";

type UpdateEpisodesResult = { success: true; addedCount: number } | { success: false; error: string };

export async function updateEpisodes(animeId: number): Promise<UpdateEpisodesResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = animeIdSchema.safeParse(animeId);
    if (!validation.success) {
        return { success: false, error: "Geçersiz anime ID" };
    }

    const supabase = await createClient();

    // Get anime data
    const { data: anime, error: animeError } = await supabase
        .from("animes")
        .select("tmdb_id, media_type, structure_type")
        .eq("id", animeId)
        .single();

    if (animeError || !anime) {
        return { success: false, error: "Anime bulunamadı." };
    }

    type AnimeEpData = { tmdb_id: number; media_type: string | null; structure_type: string | null };
    if ((anime as AnimeEpData).media_type !== "tv") {
        return { success: false, error: "Bu işlem sadece TV dizileri için geçerlidir." };
    }

    // 3. Get existing episodes to check what's already in DB
    const { data: existingEpisodes } = await supabase
        .from("episodes")
        .select("tmdb_id")
        .eq("anime_id", animeId);

    const existingTmdbIds = new Set((existingEpisodes as { tmdb_id: number }[] | null)?.map(ep => ep.tmdb_id) || []);

    // 4. Fetch details from TMDB
    const details = await getAnimeDetails((anime as AnimeEpData).tmdb_id, "tv");
    if (!details || !details.number_of_seasons) {
        return { success: false, error: "TMDB'den anime detayları alınamadı." };
    }

    // 5. Get all episodes from TMDB and filter new ones
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    let newEpisodesToInsert: Array<{
        anime_id: number;
        tmdb_id: number;
        title: string | null;
        overview: string | null;
        still_path: string | null;
        vote_average: number | null;
        air_date: string | null;
        season_number: number;
        episode_number: number;
        absolute_episode_number: number | null;
        duration: number | null;
    }> = [];

    // Get max absolute_episode_number for absolute structure
    let absoluteCounter = 1;
    if ((anime as AnimeEpData).structure_type === "absolute") {
        const { data: maxEp } = await supabase
            .from("episodes")
            .select("absolute_episode_number")
            .eq("anime_id", animeId)
            .order("absolute_episode_number", { ascending: false })
            .limit(1)
            .single();

        if ((maxEp as { absolute_episode_number: number | null } | null)?.absolute_episode_number) {
            absoluteCounter = ((maxEp as unknown) as { absolute_episode_number: number }).absolute_episode_number + 1;
        }
    }

    for (let i = 1; i <= details.number_of_seasons; i++) {
        const seasonData = await getSeasonDetails((anime as AnimeEpData).tmdb_id, i) as TMDBSeriesData | null;
        if (seasonData && seasonData.episodes) {
            const seasonEpisodes = seasonData.episodes
                .filter((ep) => {
                    // Skip if already in database
                    if (existingTmdbIds.has(ep.id)) return false;

                    // Skip if not aired yet (air_date yoksa veya gelecekteyse)
                    if (!ep.air_date) return false;

                    const episodeDate = new Date(ep.air_date);
                    episodeDate.setHours(0, 0, 0, 0);

                    // Only add episodes that aired today or in the past
                    return episodeDate <= today;
                })
                .map((ep) => ({
                    anime_id: animeId,
                    tmdb_id: ep.id,
                    title: ep.name || null,
                    overview: ep.overview || null,
                    still_path: ep.still_path || null,
                    vote_average: ep.vote_average || null,
                    air_date: ep.air_date || null,
                    season_number: ep.season_number,
                    episode_number: ep.episode_number,
                    absolute_episode_number: (anime as AnimeEpData).structure_type === "absolute" ? absoluteCounter++ : ep.episode_number,
                    duration: ep.runtime || null
                }));

            newEpisodesToInsert = [...newEpisodesToInsert, ...seasonEpisodes];
        }
    }

    // 6. Insert new episodes
    if (newEpisodesToInsert.length > 0) {
        const { error: epError } = await supabase
            .from("episodes")
            .insert(newEpisodesToInsert as never);

        if (epError) {
            return { success: false, error: "Bölüm ekleme hatası: " + epError.message };
        }
    }

    // Revalidate episode cache
    revalidateEpisodeData();

    return { success: true, addedCount: newEpisodesToInsert.length };
}

