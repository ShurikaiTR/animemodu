/**
 * Bildirim tipi - veritabanındaki type ile eşleşmeli
 */
export type NotificationType =
    | "new_episode"
    | "comment_reply"
    | "new_follower"
    | "review_like"
    | "comment_like";

/**
 * Veritabanından gelen bildirim satırı
 */
export interface NotificationRow {
    id: string;
    user_id: string;
    type: NotificationType;
    title: string;
    message: string | null;
    link: string | null;
    is_read: boolean;
    anime_id: string | null;
    episode_id: string | null;
    actor_id: string | null;
    created_at: string;
}

/**
 * Zenginleştirilmiş bildirim (UI için)
 */
export interface Notification extends NotificationRow {
    anime?: {
        title: string;
        slug: string;
        poster_path: string | null;
    } | null;
    actor?: {
        username: string;
        avatar_url: string | null;
    } | null;
}

/**
 * Bildirim oluşturma parametreleri
 */
export interface CreateNotificationParams {
    userId: string;
    type: NotificationType;
    title: string;
    message?: string;
    link?: string;
    animeId?: string;
    episodeId?: string;
    actorId?: string;
}
