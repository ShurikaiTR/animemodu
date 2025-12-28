/**
 * Database row types - derived from auto-generated Supabase types
 * Regenerate with: npx supabase gen types typescript --project-id mlzlkrsorfzreyzkpogr > src/shared/types/database.generated.ts
 */

import type { Database, Json } from "./database.generated";

// ============================================================================
// Database Row Types (from generated schema)
// ============================================================================

export type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];
export type AnimeInsert = Database["public"]["Tables"]["animes"]["Insert"];
export type AnimeUpdate = Database["public"]["Tables"]["animes"]["Update"];

export type EpisodeRow = Database["public"]["Tables"]["episodes"]["Row"];
export type EpisodeInsert = Database["public"]["Tables"]["episodes"]["Insert"];
export type EpisodeUpdate = Database["public"]["Tables"]["episodes"]["Update"];

export type CommentRow = Database["public"]["Tables"]["comments"]["Row"];
export type CommentInsert = Database["public"]["Tables"]["comments"]["Insert"];

export type ReviewRow = Database["public"]["Tables"]["reviews"]["Row"];
export type ReviewInsert = Database["public"]["Tables"]["reviews"]["Insert"];

export type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
export type ProfileInsert = Database["public"]["Tables"]["profiles"]["Insert"];
export type ProfileUpdate = Database["public"]["Tables"]["profiles"]["Update"];

export type UserAnimeListRow = Database["public"]["Tables"]["user_anime_list"]["Row"];
export type UserAnimeListInsert = Database["public"]["Tables"]["user_anime_list"]["Insert"];

export type UserFavoritesRow = Database["public"]["Tables"]["user_favorites"]["Row"];
export type UserFavoritesInsert = Database["public"]["Tables"]["user_favorites"]["Insert"];

export type ReportRow = Database["public"]["Tables"]["reports"]["Row"];
export type ReportInsert = Database["public"]["Tables"]["reports"]["Insert"];
export type ReportUpdate = Database["public"]["Tables"]["reports"]["Update"];

export type SiteSettingRow = Database["public"]["Tables"]["site_settings"]["Row"];
export type SiteSettingInsert = Database["public"]["Tables"]["site_settings"]["Insert"];
export type SiteSettingUpdate = Database["public"]["Tables"]["site_settings"]["Update"];

export type CommentLikeRow = Database["public"]["Tables"]["comment_likes"]["Row"];
export type ReviewLikeRow = Database["public"]["Tables"]["review_likes"]["Row"];

// Re-export Json type
export type { Json };

// ============================================================================
// Extended Types
// ============================================================================

export type ReportWithDetails = ReportRow & {
    anime: { id: string; title: string; slug: string; poster_path: string | null } | null;
    user: { username: string; avatar_url: string | null } | null;
};
