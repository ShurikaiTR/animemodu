"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { revalidatePath } from "next/cache";
import { logError } from "@/shared/lib/errors";
import { genreNameSchema, renameGenreSchema, formatZodError } from "@/shared/lib/validations/anime";

type ActionResult<T = void> = { success: true; data?: T } | { success: false; error: string };

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

    const supabase = await createClient();

    try {
        // Get all animes with the old genre
        const { data: animes, error: fetchError } = await supabase
            .from("animes")
            .select("id, genres");

        if (fetchError) {
            logError("renameGenre.fetch", fetchError);
            return { success: false, error: "Animeler getirilemedi." };
        }

        // Filter animes that have the old genre
        type AnimeWithGenres = { id: string; genres: string[] | null };
        const animesToUpdate = ((animes || []) as AnimeWithGenres[]).filter(
            (anime) => anime.genres?.includes(oldName)
        );

        // Update each anime in parallel
        await Promise.all(animesToUpdate.map(anime => {
            const updatedGenres = anime.genres!.map((g) => (g === oldName ? newName : g));
            return supabase
                .from("animes")
                .update({ genres: updatedGenres })
                .eq("id", anime.id);
        }));

        revalidatePath("/panel/genres");
        revalidatePath("/kesfet");

        return { success: true };
    } catch (error) {
        logError("renameGenre", error);
        return { success: false, error: "Tür adı değiştirilemedi." };
    }
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

    const supabase = await createClient();

    try {
        // Get all animes with this genre
        const { data: animes, error: fetchError } = await supabase
            .from("animes")
            .select("id, genres");

        if (fetchError) {
            logError("deleteGenre.fetch", fetchError);
            return { success: false, error: "Animeler getirilemedi." };
        }

        // Filter animes that have this genre
        type AnimeWithGenres = { id: string; genres: string[] | null };
        const animesToUpdate = ((animes || []) as AnimeWithGenres[]).filter(
            (anime) => anime.genres?.includes(genreName)
        );

        // Update each anime in parallel by removing the genre
        await Promise.all(animesToUpdate.map(anime => {
            const updatedGenres = anime.genres!.filter((g) => g !== genreName);
            return supabase
                .from("animes")
                .update({ genres: updatedGenres })
                .eq("id", anime.id);
        }));

        revalidatePath("/panel/genres");
        revalidatePath("/kesfet");

        return { success: true, data: { updatedCount: animesToUpdate.length } };
    } catch (error) {
        logError("deleteGenre", error);
        return { success: false, error: "Tür silinemedi." };
    }
}
