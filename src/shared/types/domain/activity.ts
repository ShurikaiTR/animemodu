/**
 * Aktivite tipi - veritabanındaki activity_type ile eşleşmeli
 */
export type ActivityType =
    | "watchlist_add"
    | "watchlist_update"
    | "watchlist_remove"
    | "favorite_add"
    | "favorite_remove"
    | "comment_add"
    | "review_add"
    | "profile_update"
    | "follow_add"
    | "followed_by";

/**
 * Aktivite metadata yapısı
 */
export interface ActivityMetadata {
    status?: string;
    old_status?: string;
    new_status?: string;
    changed_fields?: string[];
    anime_title?: string;
    rating?: number;
    comment_preview?: string;
    target_user_id?: string;
    target_username?: string;
    follower_user_id?: string;
    follower_username?: string;
}

/**
 * Veritabanından gelen aktivite satırı
 */
export interface ActivityRow {
    id: string;
    user_id: string;
    activity_type: ActivityType;
    anime_id: string | null;
    metadata: ActivityMetadata;
    created_at: string;
}

/**
 * Anime bilgisi ile zenginleştirilmiş aktivite
 */
export interface Activity extends ActivityRow {
    anime?: {
        title: string;
        slug: string;
        poster_path: string | null;
    } | null;
}
