/**
 * External API types (TMDB, AniList)
 */

export interface TMDBItem {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    overview?: string;
    poster_path?: string | null;
    backdrop_path?: string | null;
    vote_average?: number;
    release_date?: string;
    first_air_date?: string;
    media_type?: "movie" | "tv";
    genres?: Array<{ id: number; name: string }>;
    videos?: {
        results?: Array<{
            type: string;
            site: string;
            key: string;
        }>;
    };
}

export interface TMDBSeriesData {
    episodes?: Array<{
        id: number;
        name?: string;
        overview?: string;
        still_path?: string | null;
        air_date?: string;
        episode_number: number;
        season_number: number;
        runtime?: number;
        vote_average?: number;
    }>;
}

export interface AniListEdge {
    node?: {
        id?: number;
        name?: {
            full?: string;
            native?: string;
        };
        image?: {
            large?: string;
            medium?: string;
        };
    };
    role?: "MAIN" | "SUPPORTING" | "BACKGROUND" | string;
}
