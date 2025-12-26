
/**
 * Episode type for frontend display
 * Base episode type with all common fields
 */
export interface Episode {
    id: number;
    overview: string | null;
    still_path: string | null;
    video_url: string | null;
    air_date: string | null;
    season_number: number;
    episode_number: number;
    absolute_episode_number: number | null;
    vote_average: number | null;
    duration: number | null;
    created_at: string;
}

/**
 * Episode type for list display components
 * Allows flexible id type and includes runtime alias
 */
export interface EpisodeListItem {
    id: number | string;
    episode_number: number;
    season_number: number;
    absolute_episode_number?: number | null;
    overview: string | null;
    still_path: string | null;
    air_date: string | null;
    vote_average: number | null;
    runtime?: number;
}

/**
 * Episode type for panel management
 * Includes anime_id for editing operations
 */
export interface EpisodeManagement {
    id: number;
    overview: string | null;
    vote_average: number | null;
    air_date: string | null;
    duration: number | null;
    still_path: string | null;
    season_number: number;
    episode_number: number;
    anime_id: string;
    video_url: string | null;
}
