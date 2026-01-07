"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { revalidateAnimeData } from "@/shared/lib/cache/revalidate";
import { SlugService } from "@/shared/lib/slug-service";
import { getAnimeDetails } from "@/shared/lib/tmdb/api";
import { addAnimeSchema, formatZodError, parseFormData } from "@/shared/lib/validations/anime";

import { AnimeService } from "../services/anime-service";
import { EpisodeService } from "../services/episode-service";
import { syncAnimeCharacters } from "./meta-actions";

// ... imports ...

export async function addAnimeToDB(formData: FormData) {
    // 1. Auth Check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // 2. Validation
    const validation = parseFormData(formData, addAnimeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { tmdbItem, customTitle, structureType } = validation.data;

    return await safeAction(async () => {
        // 3. Duplicate Check
        const existingAnime = await AnimeService.getByTMDBId(tmdbItem.id);
        if (existingAnime) {
            throw new Error("Bu içerik zaten veritabanında mevcut!");
        }

        // 4. Data Preparation
        const details = await getAnimeDetails(tmdbItem.id, tmdbItem.media_type || "tv");
        const genres: string[] = details?.genres?.map((g) => g.name) || [];
        const date = tmdbItem.release_date || tmdbItem.first_air_date;
        const slug = SlugService.generate(customTitle);

        // 5. Create Anime (DB Transaction Step 1)
        let animeId: string;
        try {
            const insertedAnime = await AnimeService.create({
                tmdb_id: tmdbItem.id,
                title: customTitle,
                original_title: tmdbItem.original_title || tmdbItem.original_name || null,
                overview: tmdbItem.overview || null,
                poster_path: tmdbItem.poster_path || null,
                backdrop_path: tmdbItem.backdrop_path || tmdbItem.poster_path || null,
                vote_average: tmdbItem.vote_average ? Math.round(tmdbItem.vote_average * 10) / 10 : null,
                release_date: date || null,
                slug: slug,
                media_type: (tmdbItem.media_type || "tv") as "movie" | "tv",
                structure_type: tmdbItem.media_type === 'tv' ? structureType : null,
                genres: genres
            });
            animeId = insertedAnime.id;
        } catch (error: unknown) {
            throw new Error(error instanceof Error ? error.message : "Anime oluşturulurken hata oluştu.");
        }

        try {
            // 6. Update Trailer (Optional Side Effect)
            if (details?.videos?.results) {
                const trailer = details.videos.results.find(
                    (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
                );
                if (trailer?.key) {
                    await AnimeService.updateTrailer(animeId, trailer.key);
                }
            }

            // 7. Dependent Data (Episodes & Characters)
            if (tmdbItem.media_type === "tv" && details?.number_of_seasons) {
                await EpisodeService.importEpisodesFromTMDB({
                    tmdbId: tmdbItem.id,
                    animeId,
                    numberOfSeasons: details.number_of_seasons,
                    structureType: validation.data.structureType
                });
            }

            const syncResult = await syncAnimeCharacters(animeId);
            if (!syncResult.success) {
                throw new Error(`Character sync failed: ${syncResult.error}`);
            }

            // 8. Revalidate Cache
            revalidateAnimeData(slug);

            return { animeId };

        } catch (error: unknown) {
            // ROLLBACK
            console.error("Anime creation failed during secondary steps. Rolling back...", error);
            await AnimeService.delete(animeId);
            throw new Error(`İşlem başarısız oldu ve geri alındı: ${error instanceof Error ? error.message : "Bilinmeyen hata"}`);
        }
    }, "addAnimeToDB");
}
