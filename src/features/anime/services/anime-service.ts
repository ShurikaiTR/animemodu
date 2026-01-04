import { createClient } from "@/shared/lib/supabase/server";
import { getSeasonDetails } from "@/shared/lib/tmdb/api";
import type { AnimeRow, CharacterJson, EpisodeInsert, TMDBSeriesData } from "@/shared/types/helpers";

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
            .select("id, title, tmdb_id, media_type, structure_type, anilist_id, original_title, slug")
            .eq("id", id)
            .single();

        if (error) return null;
        return data;
    },

    async getEpisodeTMDBIds(animeId: string): Promise<number[]> {
        const supabase = await createClient();
        const { data } = await supabase
            .from("episodes")
            .select("tmdb_id")
            .eq("anime_id", animeId);

        return (data as { tmdb_id: number }[] | null)?.map(ep => ep.tmdb_id) || [];
    },

    async getMaxAbsoluteEpisodeNumber(animeId: string): Promise<number | null> {
        const supabase = await createClient();
        const { data } = await supabase
            .from("episodes")
            .select("absolute_episode_number")
            .eq("anime_id", animeId)
            .order("absolute_episode_number", { ascending: false })
            .limit(1)
            .single();

        return (data as { absolute_episode_number: number | null } | null)?.absolute_episode_number || null;
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
    },

    async importEpisodesFromTMDB(params: {
        tmdbId: number;
        animeId: string;
        numberOfSeasons: number;
        structureType: "seasonal" | "absolute";
    }): Promise<{ insertedCount: number }> {
        const { tmdbId, animeId, numberOfSeasons, structureType } = params;
        const allEpisodes: EpisodeInsert[] = [];
        let absoluteCounter = 1;

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

        for (let i = 1; i <= numberOfSeasons; i++) {
            if (i > 1) await delay(200);

            const seasonData = await getSeasonDetails(tmdbId, i) as TMDBSeriesData;
            if (!seasonData?.episodes) continue;

            const seasonEpisodes = seasonData.episodes
                .filter((ep) => {
                    if (!ep.air_date) return false;
                    const episodeDate = new Date(ep.air_date);
                    episodeDate.setHours(0, 0, 0, 0);
                    return episodeDate <= today;
                })
                .map((ep) => {
                    const isAbsolute = structureType === "absolute";
                    const absoluteNum = isAbsolute ? absoluteCounter++ : null;

                    return {
                        anime_id: animeId,
                        tmdb_id: ep.id,
                        overview: ep.overview || null,
                        still_path: ep.still_path || null,
                        vote_average: ep.vote_average || null,
                        air_date: ep.air_date || null,
                        season_number: isAbsolute ? 1 : ep.season_number,
                        episode_number: isAbsolute ? absoluteNum! : ep.episode_number,
                        absolute_episode_number: absoluteNum ?? ep.episode_number,
                        duration: ep.runtime || null
                    } as EpisodeInsert;
                });

            allEpisodes.push(...seasonEpisodes);
        }

        if (allEpisodes.length === 0) {
            return { insertedCount: 0 };
        }

        const supabase = await createClient();
        const { error } = await supabase.from("episodes").insert(allEpisodes);

        if (error) throw error;

        return { insertedCount: allEpisodes.length };
    }
};
