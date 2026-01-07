"use server";

import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { revalidateAnimeData, revalidateEpisodeData } from "@/shared/lib/cache/revalidate";
import { getErrorMessage, logError } from "@/shared/lib/errors";
import { animeIdSchema, episodeIdSchema } from "@/shared/lib/validations/anime";

import { AnimeService } from "../services/anime-service";
import { EpisodeService } from "../services/episode-service";

type DeleteResult = { success: true } | { success: false; error: string };

export async function deleteAnime(id: string): Promise<DeleteResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const validation = animeIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: "Geçersiz anime UUID" };
    }

    try {
        await AnimeService.delete(id);

        // Revalidate all anime-related cache
        revalidateAnimeData();
        return { success: true };
    } catch (error) {
        logError("deleteAnime", error);
        return { success: false, error: getErrorMessage(error, "Silme işlemi sırasında bir hata oluştu.") };
    }
}

export async function deleteEpisode(id: string, animeSlug?: string): Promise<DeleteResult> {
    // Auth kontrolü
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Doğrulama
    const validation = episodeIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: "Geçersiz bölüm ID" };
    }

    try {
        await EpisodeService.deleteEpisode(id);

        // Cache temizleme
        revalidateEpisodeData(animeSlug);
        return { success: true };
    } catch (error) {
        logError("deleteEpisode", error);
        return { success: false, error: getErrorMessage(error, "Bölüm silinirken bir hata oluştu.") };
    }
}
