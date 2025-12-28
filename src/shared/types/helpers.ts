/**
 * Type helpers - barrel export file
 * 
 * This file re-exports all types from modular type files.
 * Import from "@/shared/types/helpers" for convenience.
 */

// Database types
export type {
  AnimeRow, AnimeInsert, AnimeUpdate,
  EpisodeRow, EpisodeInsert, EpisodeUpdate,
  CommentRow, CommentInsert,
  ReviewRow, ReviewInsert,
  ProfileRow, ProfileInsert, ProfileUpdate,
  UserAnimeListRow, UserAnimeListInsert,
  UserFavoritesRow, UserFavoritesInsert,
  ReportRow, ReportInsert, ReportUpdate,
  SiteSettingRow, SiteSettingInsert, SiteSettingUpdate,
  CommentLikeRow, ReviewLikeRow,
  ReportWithDetails, Json,
} from "./database-types";

// Character types
export type { Character, CharacterJson } from "./character";
export { parseCharacters } from "./character";

// External API types
export type { TMDBItem, TMDBSeriesData, AniListEdge } from "./external-api";

// Utility types
export type { ErrorWithMessage, VideoJSPlayer } from "./utils";
export { isErrorWithMessage } from "./utils";

// Site settings
export type { SiteInfo } from "./site-settings";
export { DEFAULT_SITE_INFO } from "./site-settings";

// Watch list types (from domain)
export type {
  SocialMediaLinks, WatchListItem, WatchListItemRaw,
  WatchListAnime, WatchListAnimeMapped, WatchListResult,
  FavoriteItem, UserFavoritesWithAnime,
} from "./domain/watchlist";
