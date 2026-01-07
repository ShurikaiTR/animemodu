import { createClient } from "@/shared/lib/supabase/server";
import type { Notification, NotificationRow } from "@/shared/types/domain/notification";

export class NotificationQueryService {
    /**
     * Kullanıcının bildirimlerini getir (zenginleştirilmiş ve filtrelenmiş)
     */
    static async getUserNotifications(
        userId: string,
        limit = 50,
        filter: "all" | "likes" | "replies" | "system" = "all",
        tab: "all" | "unread" = "all"
    ): Promise<Notification[]> {
        const supabase = await createClient();

        // Query'i oluştur
        let query = supabase
            .from("notifications")
            .select("id, user_id, type, title, message, link, is_read, anime_id, episode_id, actor_id, created_at")
            .eq("user_id", userId);

        // Tab filtresi (Okunmamış)
        if (tab === "unread") {
            query = query.eq("is_read", false);
        }

        // Kategori filtresi
        if (filter === "likes") {
            query = query.in("type", ["review_like", "comment_like"]);
        } else if (filter === "replies") {
            query = query.eq("type", "comment_reply");
        } else if (filter === "system") {
            query = query.eq("type", "new_episode");
        }

        const { data: notifications, error } = await query
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (!notifications || notifications.length === 0) return [];

        const typedNotifications = notifications as unknown as NotificationRow[];

        const animeIds = typedNotifications.filter(n => n.anime_id).map(n => n.anime_id as string);
        const actorIds = typedNotifications.filter(n => n.actor_id).map(n => n.actor_id as string);

        let animesMap = new Map<string, { title: string; slug: string; poster_path: string | null }>();
        let actorsMap = new Map<string, { username: string; avatar_url: string | null }>();

        if (animeIds.length > 0) {
            const { data: animes } = await supabase
                .from("animes")
                .select("id, title, slug, poster_path")
                .in("id", animeIds);

            if (animes) {
                animesMap = new Map(animes.map(a => [a.id, { title: a.title, slug: a.slug, poster_path: a.poster_path }]));
            }
        }

        if (actorIds.length > 0) {
            const { data: actors } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", actorIds);

            if (actors) {
                actorsMap = new Map(actors.map(a => [a.id, { username: a.username || "Bilinmeyen", avatar_url: a.avatar_url }]));
            }
        }

        return typedNotifications.map(notification => ({
            ...notification,
            anime: notification.anime_id ? animesMap.get(notification.anime_id) || null : null,
            actor: notification.actor_id ? actorsMap.get(notification.actor_id) || null : null,
        }));
    }

    /**
     * Okunmamış bildirim sayısını getir
     */
    static async getUnreadCount(userId: string): Promise<number> {
        const supabase = await createClient();
        const { count, error } = await supabase
            .from("notifications")
            .select("id", { count: "exact", head: true })
            .eq("user_id", userId)
            .eq("is_read", false);

        if (error) throw error;
        return count || 0;
    }
}
