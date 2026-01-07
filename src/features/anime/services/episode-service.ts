import { createClient } from "@/shared/lib/supabase/server";
import { getSeasonDetails } from "@/shared/lib/tmdb/api";
import type { EpisodeInsert, TMDBSeriesData } from "@/shared/types/helpers";

export const EpisodeService = {
    async deleteEpisode(id: string) {
        const supabase = await createClient();
        const { error } = await supabase
            .from("episodes")
            .delete()
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

    async insertEpisodes(episodes: EpisodeInsert[]) {
        if (episodes.length === 0) return;
        const supabase = await createClient();
        const { error } = await supabase
            .from("episodes")
            .insert(episodes);

        if (error) throw new Error("Bölüm ekleme hatası: " + error.message);
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
