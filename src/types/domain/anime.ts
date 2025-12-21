/**
 * Domain types for anime-related entities
 * These are the canonical types used throughout the application
 */

// Re-export database row types for convenience
export type { AnimeRow, EpisodeRow } from "../helpers";
export type { Character, CharacterJson } from "../supabase/tables/characters";

// Episode types are moved to ./episode.ts
export * from "./episode";
import { Episode } from "./episode";


/**
 * Cast member type
 */
export interface CastMember {
    id: number;
    name: string;
    character: string;
    profile_path: string | null;
    role?: "MAIN" | "SUPPORTING" | "BACKGROUND";
}

/**
 * Video result from TMDB
 */
export interface VideoResult {
    id: string;
    key: string;
    name: string;
    site: string;
    type: string;
}

/**
 * Full anime detail data combining database and API data
 */
export interface AnimeDetailData {
    id: number;
    name?: string;
    title: string;
    overview: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number | null;
    release_date: string | null;
    first_air_date?: string | null;
    status: string;
    genres: { id: number; name: string }[];
    production_companies: { id: number; name: string; logo_path: string | null }[];
    credits: { cast: CastMember[] };
    similar: { results: SimilarResult[] };
    videos: { results: VideoResult[] };
    number_of_episodes: number;
    number_of_seasons: number;
    characters: Array<{
        id?: number;
        name?: { full?: string } | string;
        image?: { large?: string };
    }> | null;
    slug?: string;
}

/**
 * Props for anime detail client component
 */
export interface AnimeDetailClientProps {
    anime: AnimeDetailData;
    episodes: Episode[];
    structureType: "seasonal" | "absolute";
}

/**
 * Database anime row with typed characters
 */
export interface DatabaseAnime {
    id: number;
    tmdb_id: number;
    title: string;
    overview: string | null;
    poster_path: string | null;
    backdrop_path: string | null;
    vote_average: number | null;
    release_date: string | null;
    slug: string;
    media_type: "movie" | "tv";
    structure_type: "seasonal" | "absolute" | null;
    genres: string[] | null;
    characters: Array<{
        id?: number;
        name?: { full?: string } | string;
        image?: { large?: string };
        role?: string;
    }> | null;
    trailer_key?: string | null;
    episodes?: Episode[];
}

/**
 * Similar anime result
 */
export interface SimilarResult {
    id: number;
    name?: string;
    title?: string;
    poster_path: string | null;
    vote_average: number;
}

