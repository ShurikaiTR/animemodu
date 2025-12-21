"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnimeCharacters, searchAniList } from "@/lib/anilist";
import type { CharacterJson } from "@/types/supabase/tables/characters";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { animeIdSchema } from "@/lib/validations/anime";

type SyncCharactersResult = { success: true; count: number } | { success: false; error: string };

export async function syncAnimeCharacters(animeId: number): Promise<SyncCharactersResult> {
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

    const { data: anime, error } = await supabase
        .from("animes")
        .select("id, title, anilist_id, original_title")
        .eq("id", animeId)
        .single();

    if (error || !anime) {
        return { success: false, error: "Anime bulunamadı." };
    }

    type AnimeData = { id: number; title: string; anilist_id: number | null; original_title: string | null };
    let anilistId = (anime as AnimeData).anilist_id;

    if (!anilistId) {
        const searchResults = await searchAniList((anime as AnimeData).title);

        if (searchResults && searchResults.length > 0) {
            anilistId = searchResults[0].id;

            await supabase
                .from("animes")
                .update({ anilist_id: anilistId } as never)
                .eq("id", animeId);
        } else {
            if ((anime as AnimeData).original_title) {
                const searchResultsOriginal = await searchAniList((anime as AnimeData).original_title!);
                if (searchResultsOriginal && searchResultsOriginal.length > 0) {
                    anilistId = searchResultsOriginal[0].id;
                    await supabase
                        .from("animes")
                        .update({ anilist_id: anilistId } as never)
                        .eq("id", animeId);
                }
            }
        }
    }

    if (!anilistId) {
        return { success: false, error: "AniList'te bu anime bulunamadı." };
    }

    const characters: CharacterJson = await getAnimeCharacters(anilistId);

    const { error: updateError } = await supabase
        .from("animes")
        .update({ characters } as never)
        .eq("id", animeId);

    if (updateError) {
        return { success: false, error: "Veritabanı güncellenemedi." };
    }

    return { success: true, count: characters.length };
}










