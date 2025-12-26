"use server";

import { createClient } from "@/lib/supabase/server";
import { getAnimeDetails } from "@/lib/tmdb/details";
import { syncAnimeCharacters } from "./syncCharacters";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { addAnimeSchema, parseFormData, formatZodError } from "@/lib/validations/anime";
import { revalidateAnimeData } from "@/lib/cache/revalidate";
import { insertEpisodesFromTMDB } from "@/lib/anime/episodes";


type AddAnimeResult = { success: true; animeId: string } | { success: false; error: string };

export async function addAnimeToDB(formData: FormData): Promise<AddAnimeResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = parseFormData(formData, addAnimeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { tmdbItem, customTitle, structureType } = validation.data;
    const supabase = await createClient();

    // Check if duplicate
    const { data: existingAnime } = await supabase
        .from("animes")
        .select("id")
        .eq("tmdb_id", tmdbItem.id)
        .single();

    if (existingAnime) {
        return { success: false, error: "Bu içerik zaten veritabanında mevcut!" };
    }

    const details = await getAnimeDetails(tmdbItem.id, tmdbItem.media_type || "tv");
    const genres: string[] = details?.genres?.map((g) => g.name) || [];

    const date = tmdbItem.release_date || tmdbItem.first_air_date;
    const slugCandidate = customTitle.toLowerCase()
        .replace(/×/g, "x")
        .replace(/&/g, "ve")
        .replace(/ /g, "-")
        .replace(/[^\w-]+/g, "");

    const animeData = {
        tmdb_id: tmdbItem.id,
        title: customTitle,
        original_title: tmdbItem.original_title || tmdbItem.original_name || null,
        overview: tmdbItem.overview || null,
        poster_path: tmdbItem.poster_path || null,
        backdrop_path: tmdbItem.backdrop_path || tmdbItem.poster_path || null,
        vote_average: tmdbItem.vote_average ? Math.round(tmdbItem.vote_average * 10) / 10 : null,
        release_date: date || null,
        slug: slugCandidate,
        media_type: (tmdbItem.media_type || "tv") as "movie" | "tv",
        structure_type: tmdbItem.media_type === 'tv' ? structureType : null,
        genres: genres
    };

    const { data: insertedAnime, error: animeError } = await supabase
        .from("animes")
        .insert(animeData as never)
        .select()
        .single();

    if (animeError) {
        return { success: false, error: "Anime eklenirken hata: " + animeError.message };
    }

    const animeId = (insertedAnime as { id: string }).id;

    if (details && details.videos && details.videos.results) {
        const trailer = details.videos.results.find(
            (v: { type: string; site: string }) => v.type === "Trailer" && v.site === "YouTube"
        );
        if (trailer && trailer.key) {
            await supabase
                .from("animes")
                .update({ trailer_key: trailer.key } as never)
                .eq("id", animeId);
        }
    }

    if (tmdbItem.media_type === "tv" && details?.number_of_seasons) {
        await insertEpisodesFromTMDB(
            supabase,
            tmdbItem.id,
            animeId,
            details.number_of_seasons,
            structureType
        );
    }


    await syncAnimeCharacters(animeId);

    // Revalidate all anime-related cache
    revalidateAnimeData(slugCandidate);

    return { success: true, animeId };
}



