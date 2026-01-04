"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { revalidateAnimeData, revalidateEpisodeData, revalidateFeaturedAnime } from "@/shared/lib/cache/revalidate";
import { createClient } from "@/shared/lib/supabase/server";
import { getAnimeDetails, getSeasonDetails } from "@/shared/lib/tmdb/api";
import { animeIdSchema, formatZodError, parseFormData, updateAnimeSchema, updateEpisodeSchema } from "@/shared/lib/validations/anime";
import type { TMDBSeriesData } from "@/shared/types/helpers";

import { AnimeService } from "../services/anime-service";
import { type EpisodeInsertData, mapTMDBEpisodesToDB } from "./episodeHelpers";

type AnimeEpData = { tmdb_id: number; media_type: string | null; structure_type: string | null };

export async function updateAnime(formData: FormData) {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const validation = parseFormData(formData, updateAnimeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { id, is_featured, ...rest } = validation.data;

    // Build update data
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
        if (value !== null && value !== undefined) data[key] = value;
    }
    if (is_featured !== undefined) data.is_featured = is_featured;

    return await safeAction(async () => {
        await AnimeService.update(id, data);

        // Revalidate cache
        if (data.is_featured !== undefined) revalidateFeaturedAnime();
        revalidateAnimeData(data.slug as string | undefined);
    }, "updateAnime");
}

export async function updateEpisode(formData: FormData) {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const validation = parseFormData(formData, updateEpisodeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { id, ...rest } = validation.data;

    // Build update data
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) data[key] = value;
    }

    return await safeAction(async () => {
        await AnimeService.updateEpisode(id, data);
        revalidateEpisodeData();
    }, "updateEpisode");
}

export async function updateEpisodes(animeId: string) {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    const validation = animeIdSchema.safeParse(animeId);
    if (!validation.success) return { success: false, error: "Geçersiz anime UUID" };

    // We still need supabase here to read initial state or we can add getById to service.
    // For now, let's use createClient for read if service doesn't have it, or extend service.
    // AnimeService.getByTMDBId exists but we have ID here.
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

        const maxEpResult = maxEp as { absolute_episode_number: number | null } | null;
        if (maxEpResult?.absolute_episode_number) {
            absoluteCounter.value = maxEpResult.absolute_episode_number + 1;
        }
    }

    let newEpisodesToInsert: EpisodeInsertData[] = [];

    // Parallel fetch all seasons
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
        return await safeAction(async () => {
            await AnimeService.insertEpisodes(newEpisodesToInsert);
            revalidateEpisodeData();
            return { addedCount: newEpisodesToInsert.length };
        }, "updateEpisodes");
    }

    revalidateEpisodeData();
    return { success: true, data: { addedCount: 0 } };
}
