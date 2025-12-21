import type { EpisodeRow, TMDBSeriesData } from "@/types/helpers";
import type { Episode } from "@/types/domain/anime";
import { getSeasonDetails } from "@/lib/tmdb/details";
import { logError } from "@/lib/errors";
import type { SupabaseClient } from "@supabase/supabase-js";

/**
 * Episode insert data type for database operations
 */
export interface EpisodeInsertData {
  anime_id: number;
  tmdb_id: number;
  title: string | null;
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
    title: ep.title,
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

/**
 * Fetches episodes from TMDB and inserts them into the database
 * Filters out future episodes and handles absolute numbering
 */
export async function insertEpisodesFromTMDB(
  supabase: SupabaseClient,
  tmdbId: number,
  animeId: number,
  numberOfSeasons: number,
  structureType: "seasonal" | "absolute"
): Promise<{ insertedCount: number }> {
  const allEpisodes: EpisodeInsertData[] = [];
  let absoluteCounter = 1;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  for (let i = 1; i <= numberOfSeasons; i++) {
    const seasonData = await getSeasonDetails(tmdbId, i) as TMDBSeriesData | null;
    if (!seasonData?.episodes) continue;

    const seasonEpisodes = seasonData.episodes
      .filter((ep) => {
        if (!ep.air_date) return false;
        const episodeDate = new Date(ep.air_date);
        episodeDate.setHours(0, 0, 0, 0);
        return episodeDate <= today;
      })
      .map((ep) => ({
        anime_id: animeId,
        tmdb_id: ep.id,
        title: ep.name || null,
        overview: ep.overview || null,
        still_path: ep.still_path || null,
        vote_average: ep.vote_average || null,
        air_date: ep.air_date || null,
        season_number: ep.season_number,
        episode_number: ep.episode_number,
        absolute_episode_number: structureType === "absolute" ? absoluteCounter++ : ep.episode_number,
        duration: ep.runtime || null
      }));

    allEpisodes.push(...seasonEpisodes);
  }

  if (allEpisodes.length === 0) {
    return { insertedCount: 0 };
  }

  const { error } = await supabase.from("episodes").insert(allEpisodes);

  if (error) {
    logError("insertEpisodesFromTMDB", error);
    return { insertedCount: 0 };
  }

  return { insertedCount: allEpisodes.length };
}
