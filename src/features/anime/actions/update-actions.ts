"use server";

import { NotificationMutationService } from "@/features/notifications/services/notification-mutation-service";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { revalidateAnimeData, revalidateEpisodeData, revalidateFeaturedAnime } from "@/shared/lib/cache/revalidate";
import { getAnimeDetails, getSeasonDetails } from "@/shared/lib/tmdb/api";
import { animeIdSchema, formatZodError, parseFormData, updateAnimeSchema, updateEpisodeSchema } from "@/shared/lib/validations/anime";
import type { TMDBSeriesData } from "@/shared/types/helpers";

import { AnimeService } from "../services/anime-service";
import { EpisodeService } from "../services/episode-service";
import { type EpisodeInsertData, mapTMDBEpisodesToDB } from "./episodeHelpers";

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
        await EpisodeService.updateEpisode(id, data);
        revalidateEpisodeData();
    }, "updateEpisode");
}

export async function updateEpisodes(animeId: string) {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    const validation = animeIdSchema.safeParse(animeId);
    if (!validation.success) return { success: false, error: "Geçersiz anime UUID" };

    // Use service to fetch anime data
    const anime = await AnimeService.getById(animeId);

    if (!anime) return { success: false, error: "Anime bulunamadı." };

    if (anime.media_type !== "tv") {
        return { success: false, error: "Bu işlem sadece TV dizileri için geçerlidir." };
    }

    // Get existing episode IDs from service
    const existingTmdbIdsArr = await EpisodeService.getEpisodeTMDBIds(animeId);
    const existingTmdbIds = new Set(existingTmdbIdsArr);

    const details = await getAnimeDetails(anime.tmdb_id, "tv");
    if (!details || !details.number_of_seasons) {
        return { success: false, error: "TMDB'den anime detayları alınamadı." };
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const isAbsolute = anime.structure_type === "absolute";
    const absoluteCounter = { value: 1 };

    if (isAbsolute) {
        const maxEpNumber = await EpisodeService.getMaxAbsoluteEpisodeNumber(animeId);
        if (maxEpNumber) {
            absoluteCounter.value = maxEpNumber + 1;
        }
    }

    let newEpisodesToInsert: EpisodeInsertData[] = [];

    // Parallel fetch all seasons
    const seasonPromises = Array.from(
        { length: details.number_of_seasons },
        (_, i) => getSeasonDetails(anime.tmdb_id, i + 1)
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
            await EpisodeService.insertEpisodes(newEpisodesToInsert);
            revalidateEpisodeData();

            // Yeni bölümler eklendiyse izleme listesindeki kullanıcılara bildirim gönder
            const latestEpisode = newEpisodesToInsert[newEpisodesToInsert.length - 1];
            const episodeLabel = latestEpisode.absolute_episode_number
                ? `Bölüm ${latestEpisode.absolute_episode_number}`
                : `S${latestEpisode.season_number}E${latestEpisode.episode_number}`;

            await NotificationMutationService.notifyWatchlistUsersSimple(
                animeId,
                anime.title,
                episodeLabel,
                anime.slug
            );

            return { addedCount: newEpisodesToInsert.length };
        }, "updateEpisodes");
    }

    revalidateEpisodeData();
    return { success: true, data: { addedCount: 0 } };
}
