"use server";

import { revalidatePath } from "next/cache";

import { ActionResult, safeAction } from "@/shared/lib/actions/wrapper";
import { getAnimeCharacters, searchAniList } from "@/shared/lib/anilist";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { animeIdSchema, formatZodError, genreNameSchema, renameGenreSchema } from "@/shared/lib/validations/anime";
import type { CharacterJson } from "@/shared/types/helpers";

import { AnimeService } from "../services/anime-service";

/**
 * Synchronizes anime characters from AniList
 */
export async function syncAnimeCharacters(animeId: string): Promise<ActionResult<{ count: number }>> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const validation = animeIdSchema.safeParse(animeId);
    if (!validation.success) return { success: false, error: "Geçersiz anime ID" };

    return await safeAction(async () => {
        const anime = await AnimeService.getById(animeId);
        if (!anime) throw new Error("Anime bulunamadı.");

        let anilistId = anime.anilist_id;

        if (!anilistId) {
            // Try searching by current title
            let searchResults = await searchAniList(anime.title);

            // If not found, try original title
            if ((!searchResults || searchResults.length === 0) && anime.original_title) {
                searchResults = await searchAniList(anime.original_title);
            }

            if (searchResults && searchResults.length > 0) {
                anilistId = searchResults[0].id;
                await AnimeService.updateAnilistId(animeId, anilistId);
            }
        }

        if (!anilistId) {
            throw new Error("AniList'te bu anime bulunamadı.");
        }

        const anilistCharacters = await getAnimeCharacters(anilistId);

        // Map AniListCharacter[] to CharacterJson (Character[])
        const characters: CharacterJson = anilistCharacters.map(c => ({
            id: c.id,
            name: c.name.full,
            native_name: c.name.native,
            image: c.image.large,
            role: c.role,
        }));

        await AnimeService.updateCharacters(animeId, characters);

        return { count: characters.length };
    }, "syncCharacters");
}

/**
 * Renames a genre across all animes
 */
export async function renameGenre(oldName: string, newName: string): Promise<ActionResult> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Zod validation
    const validation = renameGenreSchema.safeParse({ oldName, newName });
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    return await safeAction(async () => {
        // Optimized fetch: Only get animes that actually have this genre
        const animesToUpdate = await AnimeService.getAnimesWithGenre(oldName);

        // Update each anime in parallel
        await Promise.all(animesToUpdate.map(anime => {
            const updatedGenres = (anime.genres || []).map((g) => (g === oldName ? newName : g));
            return AnimeService.updateGenres(anime.id, updatedGenres);
        }));

        revalidatePath("/panel/genres");
        revalidatePath("/kesfet");
    }, "renameGenre");
}

/**
 * Deletes a genre from all animes
 */
export async function deleteGenre(genreName: string): Promise<ActionResult<{ updatedCount: number }>> {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Zod validation
    const validation = genreNameSchema.safeParse(genreName);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    return await safeAction(async () => {
        // Optimized fetch
        const animesToUpdate = await AnimeService.getAnimesWithGenre(genreName);

        // Update each anime in parallel
        await Promise.all(animesToUpdate.map(anime => {
            const updatedGenres = (anime.genres || []).filter((g) => g !== genreName);
            return AnimeService.updateGenres(anime.id, updatedGenres);
        }));

        revalidatePath("/panel/genres");
        revalidatePath("/kesfet");

        return { updatedCount: animesToUpdate.length };
    }, "deleteGenre");
}
