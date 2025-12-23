import type { AnimesTable, EpisodesTable, CommentsTable, ReviewsTable, ProfilesTable, Character, CharacterJson, ReportsTable } from "./supabase/tables";

// Watch list types
export type {
  SocialMediaLinks,
  WatchListItem,
  WatchListItemRaw,
  WatchListAnime,
  WatchListAnimeMapped,
  WatchListResult,
  FavoriteItem,
  UserFavoritesWithAnime
} from "./domain/watchlist";

export type AnimeRow = AnimesTable["Row"];
export type EpisodeRow = EpisodesTable["Row"];
export type CommentRow = CommentsTable["Row"];
export type ReviewRow = ReviewsTable["Row"];
export type ProfileRow = ProfilesTable["Row"];
export type UserAnimeListRow = import("./supabase/tables/user-list").UserAnimeListTable["Row"];
export type UserFavoritesRow = import("./supabase/tables/favorites").UserFavoritesTable["Row"];
export type ReportRow = ReportsTable["Row"];
export type ReportInsert = ReportsTable["Insert"];

export type ReportWithDetails = ReportRow & {
  anime: { id: number; title: string; slug: string; poster_path: string | null } | null;
  user: { username: string; avatar_url: string | null } | null;
};

// Re-export Character types for backward compatibility
export type { Character, CharacterJson };

/**
 * @deprecated Use Character type directly instead
 */
export type CharacterData = Character;

/**
 * Safely extracts characters from database JSON column
 * Returns empty array if null or invalid
 */
export function parseCharacters(characters: CharacterJson | null | undefined): Character[] {
  if (!characters || !Array.isArray(characters)) return [];
  return characters;
}

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

export interface ErrorWithMessage {
  message: string;
}

export function isErrorWithMessage(error: unknown): error is ErrorWithMessage {
  return (
    typeof error === "object" &&
    error !== null &&
    "message" in error &&
    typeof (error as Record<string, unknown>).message === "string"
  );
}

export interface VideoJSPlayer {
  play: () => Promise<void>;
  pause: () => void;
  dispose: () => void;
  ready: (callback: () => void) => void;
  on: (event: string, callback: () => void) => void;
  nuevo?: (options: unknown) => void;
}

declare global {
  interface Window {
    videojs?: {
      (element: HTMLElement | string, options?: unknown): VideoJSPlayer;
    };
  }
}

