export interface TMDBResult {
    id: number;
    title?: string;
    name?: string;
    media_type: "movie" | "tv";
    poster_path: string | null;
    backdrop_path: string | null;
    overview: string;
    release_date?: string;
    first_air_date?: string;
    vote_average: number;
    genre_ids?: number[];
}

export interface TMDBDetailResult {
    id: number;
    title?: string;
    name?: string;
    original_title?: string;
    original_name?: string;
    overview: string;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number;
    vote_count: number;
    release_date?: string;
    first_air_date?: string;
    runtime?: number;
    episode_run_time?: number[];
    number_of_seasons?: number;
    number_of_episodes?: number;
    status: string;
    genres: { id: number; name: string }[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    credits?: {
        cast: { id: number; name: string; character: string; profile_path: string | null }[];
    };
    videos?: {
        results: { id: string; key: string; name: string; site: string; type: string }[];
    };
    similar?: {
        results: TMDBResult[];
    };
}

export interface Genre {
    id: number;
    name: string;
}

export interface TMDBEpisode {
    id: number;
    name: string;
    overview: string;
    still_path: string | null;
    vote_average: number;
    vote_count: number;
    air_date: string;
    episode_number: number;
    season_number: number;
    runtime: number | null;
    guest_stars?: {
        id: number;
        name: string;
        character: string;
        profile_path: string | null;
    }[];
}

export interface TMDBSeriesData {
    _id?: string;
    air_date?: string;
    episodes?: TMDBEpisode[];
    name?: string;
    overview?: string;
    id?: number;
    poster_path?: string | null;
    season_number?: number;
    vote_average?: number;
}
