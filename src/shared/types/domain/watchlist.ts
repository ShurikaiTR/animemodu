// Watch status type - matches database enum
export type WatchStatus = "watching" | "completed" | "planned" | "on_hold" | "dropped";

/**
 * Sosyal medya linkleri için type-safe interface
 */
export interface SocialMediaLinks {
    twitter?: string;
    instagram?: string;
    github?: string;
    website?: string;
    youtube?: string;
    discord?: string;
    tiktok?: string;
}

/**
 * Watch list item'daki anime bilgileri
 */
export interface WatchListAnime {
    id: string;
    title: string;
    slug: string;
    poster_path: string | null;
    vote_average: number | null;
    release_date: string | null;
    genres: string[] | null;
}

/**
 * Frontend'de kullanılan mapped anime bilgileri
 */
export interface WatchListAnimeMapped {
    id: string;
    title: string;
    slug: string;
    poster_url: string | null;
    score: number | null;
    release_year: number;
    genres: string[] | null;
}

/**
 * Supabase'den gelen raw watch list item (join ile)
 */
export interface WatchListItemRaw {
    id: string;
    user_id: string;
    anime_id: string;
    status: WatchStatus;
    score: number | null;
    created_at: string;
    updated_at: string;
    anime: WatchListAnime;
}

/**
 * Mapped favorites item for frontend
 */
export interface FavoriteItem {
    id: string; // favorite record id
    user_id: string;
    anime_id: string;
    created_at: string;
    anime: WatchListAnimeMapped;
}

/**
 * Raw Favorites item with join data
 */
export interface UserFavoritesWithAnime {
    id: string;
    anime_id: string;
    created_at: string;
    anime: WatchListAnime;
}

/**
 * Frontend'de kullanılan watch list item (mapped)
 */
export interface WatchListItem {
    id: string;
    user_id: string;
    anime_id: string;
    status: WatchStatus;
    score: number | null;
    created_at: string;
    updated_at: string;
    anime: WatchListAnimeMapped;
}

/**
 * Server action sonuç tipi
 */
export type WatchListResult =
    | { success: true; data: WatchListItem[] }
    | { success: false; error: string };
