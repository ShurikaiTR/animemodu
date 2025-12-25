import type { TMDBSeriesData } from "@/types/helpers";

export interface EpisodeInsertData {
    anime_id: number;
    tmdb_id: number;
    overview: string | null;
    still_path: string | null;
    vote_average: number | null;
    air_date: string | null;
    season_number: number;
    episode_number: number;
    absolute_episode_number: number | null;
    duration: number | null;
}

interface MapEpisodesOptions {
    animeId: number;
    isAbsolute: boolean;
    existingTmdbIds: Set<number>;
    today: Date;
    absoluteCounter: { value: number };
}

/**
 * Maps TMDB episode data to database insert format
 */
export function mapTMDBEpisodesToDB(
    seasonData: TMDBSeriesData,
    options: MapEpisodesOptions
): EpisodeInsertData[] {
    const { animeId, isAbsolute, existingTmdbIds, today, absoluteCounter } = options;

    if (!seasonData.episodes) return [];

    return seasonData.episodes
        .filter((ep) => {
            // Skip if already in database
            if (existingTmdbIds.has(ep.id)) return false;

            // Skip if not aired yet
            if (!ep.air_date) return false;

            const episodeDate = new Date(ep.air_date);
            episodeDate.setHours(0, 0, 0, 0);

            return episodeDate <= today;
        })
        .map((ep) => {
            const absoluteNum = isAbsolute ? absoluteCounter.value++ : null;

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
            };
        });
}
