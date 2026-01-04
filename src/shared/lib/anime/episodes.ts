import type { Episode } from "@/shared/types/domain/anime";
import type { EpisodeRow } from "@/shared/types/helpers";

/**
 * Episode insert data type for database operations
 */
export interface EpisodeInsertData {
  anime_id: string;
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

export function mapEpisodeRowToEpisode(ep: EpisodeRow): Episode {
  return {
    id: ep.id,
    overview: ep.overview,
    still_path: ep.still_path,
    video_url: ep.video_url,
    air_date: ep.air_date,
    season_number: ep.season_number,
    episode_number: ep.episode_number,
    absolute_episode_number: ep.absolute_episode_number,
    vote_average: ep.vote_average,
    duration: ep.duration,
    created_at: ep.created_at,
  };
}

export function mapEpisodeRowsToEpisodes(episodes: EpisodeRow[]): Episode[] {
  return episodes.map(mapEpisodeRowToEpisode);
}

export function filterAiredEpisodes(episodes: EpisodeRow[]): EpisodeRow[] {
  const now = new Date();
  return episodes.filter((ep) => {
    if (!ep.air_date) return false;
    return new Date(ep.air_date) <= now;
  });
}

export function orderEpisodesBySeasonAndNumber<T extends { order: (column: string, options?: { ascending: boolean }) => T }>(query: T): T {
  return query
    .order("season_number", { ascending: true })
    .order("episode_number", { ascending: true });
}


