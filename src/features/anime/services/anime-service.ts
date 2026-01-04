import { createClient } from "@/shared/lib/supabase/server";
import type { AnimeRow, CharacterJson } from "@/shared/types/helpers";

import type { EpisodeInsertData } from "../actions/episodeHelpers";

export type CreateAnimeDTO = {
    tmdb_id: number;
    title: string;
    original_title: string | null;
    overview: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number | null;
    release_date: string | null;
    slug: string;
    media_type: "movie" | "tv";
    structure_type: "seasonal" | "absolute" | null;
    genres: string[];
};

export const AnimeService = {
    async getByTMDBId(tmdbId: number) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("animes")
            .select("id")
            .eq("tmdb_id", tmdbId)
            .single();

        return data;
    },

    async create(data: CreateAnimeDTO) {
        const supabase = await createClient();
        const { data: insertedAnime, error } = await supabase
            .from("animes")
            .insert(data)
            .select()
            .single<AnimeRow>();

        if (error || !insertedAnime) {
            throw new Error("Anime eklenirken hata: " + (error?.message || "Bilinmeyen hata"));
        }

        return insertedAnime;
    },

    async updateTrailer(animeId: string, trailerKey: string) {
        const supabase = await createClient();
        await supabase
            .from("animes")
            .update({ trailer_key: trailerKey })
            .eq("id", animeId);
    },

    async delete(animeId: string) {
        const supabase = await createClient();

        // 1. Parallel fetch comments and reviews to get their IDs for likes deletion
        const [{ data: comments }, { data: reviews }] = await Promise.all([
            supabase.from("comments").select("id").eq("anime_id", animeId),
            supabase.from("reviews").select("id").eq("anime_id", animeId)
        ]);

        const commentIds = (comments as { id: string }[] | null)?.map(c => c.id) || [];
        const reviewIds = (reviews as { id: string }[] | null)?.map(r => r.id) || [];

        // 2. Parallel delete likes (must happen before comments/reviews due to FK)
        await Promise.all([
            commentIds.length > 0 ? supabase.from("comment_likes").delete().in("comment_id", commentIds) : Promise.resolve(),
            reviewIds.length > 0 ? supabase.from("review_likes").delete().in("review_id", reviewIds) : Promise.resolve()
        ]);

        // 3. Parallel delete comments, reviews and episodes
        await Promise.all([
            supabase.from("comments").delete().eq("anime_id", animeId),
            supabase.from("reviews").delete().eq("anime_id", animeId),
            supabase.from("episodes").delete().eq("anime_id", animeId)
        ]);

        // 4. Finally delete the anime
        const { error } = await supabase
            .from("animes")
            .delete()
            .eq("id", animeId);

        if (error) throw new Error(error.message);
    },

    async deleteEpisode(id: string) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("episodes")
            .delete()
            .eq("id", id);

        if (error) throw new Error(error.message);
    },

    async update(id: string, data: Partial<AnimeRow>) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("animes")
            .update(data)
            .eq("id", id);

        if (error) throw new Error(error.message);
    },

    async updateEpisode(id: string, data: Record<string, unknown>) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("episodes")
            .update(data)
            .eq("id", id);

        if (error) throw new Error(error.message);
    },

    async insertEpisodes(episodes: EpisodeInsertData[]) {
        if (episodes.length === 0) return;
        const supabase = await createClient();
        const { error } = await supabase
            .from("episodes")
            .insert(episodes);

        if (error) throw new Error("Bölüm ekleme hatası: " + error.message);
    },

    async getById(id: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("animes")
            .select("id, title, anilist_id, original_title")
            .eq("id", id)
            .single();

        if (error) return null;
        return data;
    },

    async updateCharacters(id: string, characters: CharacterJson) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("animes")
            .update({ characters: JSON.parse(JSON.stringify(characters)) })
            .eq("id", id);

        if (error) throw new Error("Karakterler güncellenemedi: " + error.message);
    },

    async updateAnilistId(id: string, anilistId: number) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("animes")
            .update({ anilist_id: anilistId })
            .eq("id", id);

        if (error) throw new Error("AniList ID güncellenemedi: " + error.message);
    },

    async getAnimesWithGenre(genre: string) {
        const supabase = await createClient();
        // Use optimized 'contains' filter for array column
        const { data, error } = await supabase
            .from("animes")
            .select("id, genres")
            .contains("genres", [genre]);

        if (error) throw new Error("Animeler getirilemedi: " + error.message);
        return data || [];
    },

    async updateGenres(id: string, genres: string[]) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("animes")
            .update({ genres })
            .eq("id", id);

        if (error) throw new Error("Türler güncellenemedi: " + error.message);
    }
};
