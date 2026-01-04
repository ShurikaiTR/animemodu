/**
 * Type helpers - barrel export file
 * 
 * This file re-exports all types from modular type files.
 * Import from "@/shared/types/helpers" for convenience.
 */

// Database types
export type {
AnimeInsert,   AnimeRow, AnimeUpdate,
CommentInsert,
  CommentLikeRow,   CommentRow, EpisodeInsert,   EpisodeRow, EpisodeUpdate,
Json,
ProfileInsert,   ProfileRow, ProfileUpdate,
ReportInsert,   ReportRow, ReportUpdate,
  ReportWithDetails, ReviewInsert,
ReviewLikeRow,
  ReviewRow, SiteSettingInsert,   SiteSettingRow, SiteSettingUpdate,
UserAnimeListInsert,
  UserAnimeListRow, UserFavoritesInsert,
  UserFavoritesRow, } from "./database-types";

// Character types
export type { Character, CharacterJson } from "./character";
export { parseCharacters } from "./character";

// External API types
export type { AniListEdge,TMDBItem, TMDBSeriesData } from "./external-api";

// Utility types
export type { ErrorWithMessage, VideoJSPlayer } from "./utils";
export { isErrorWithMessage } from "./utils";

// Site settings
export type { SiteInfo } from "./site-settings";
export { DEFAULT_SITE_INFO } from "./site-settings";

// Watch list types (from domain)
export type {
  FavoriteItem,   SocialMediaLinks, UserFavoritesWithAnime,
  WatchListAnime, WatchListAnimeMapped, WatchListItem, WatchListItemRaw,
WatchListResult,
} from "./domain/watchlist";

// Activity types (from domain)
export type {
Activity,
ActivityMetadata, ActivityRow,   ActivityType, } from "./domain/activity";
