import { createClient } from "@/shared/lib/supabase/server";
import type {
    CreateNotificationParams,
    Notification,
    NotificationRow,
} from "@/shared/types/domain/notification";

/**
 * Notification Service - Bildirim işlemleri için servis sınıfı
 */
export class NotificationService {
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

    /**
     * Tek bir bildirimi okundu olarak işaretle
     */
    static async markAsRead(userId: string, notificationId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("id", notificationId)
            .eq("user_id", userId);

        if (error) throw error;
    }

    /**
     * Tüm bildirimleri okundu olarak işaretle
     */
    static async markAllAsRead(userId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("notifications")
            .update({ is_read: true })
            .eq("user_id", userId)
            .eq("is_read", false);

        if (error) throw error;
    }

    /**
     * Bildirimi sil
     */
    static async deleteNotification(userId: string, notificationId: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("notifications")
            .delete()
            .eq("id", notificationId)
            .eq("user_id", userId);

        if (error) throw error;
    }

    /**
     * Yeni bildirim oluştur
     */
    static async createNotification(params: CreateNotificationParams): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("notifications")
            .insert({
                user_id: params.userId,
                type: params.type,
                title: params.title,
                message: params.message || null,
                link: params.link || null,
                anime_id: params.animeId || null,
                episode_id: params.episodeId || null,
                actor_id: params.actorId || null,
                is_read: false
            });

        if (error) throw error;
    }

    /**
     * İzleme listesindeki kullanıcılara basit bildirim gönder
     */
    static async notifyWatchlistUsersSimple(
        animeId: string,
        animeTitle: string,
        episodeLabel: string,
        animeSlug: string
    ): Promise<void> {
        const supabase = await createClient();

        // 1. İzleme listesinde olan kullanıcıları bul
        const { data: watchlistItems } = await supabase
            .from("user_lists")
            .select("user_id")
            .eq("anime_id", animeId)
            .in("status", ["watching", "plan_to_watch"]);

        if (!watchlistItems || watchlistItems.length === 0) return;

        // 2. Her kullanıcı için bildirim oluştur
        const notifications = watchlistItems.map(item => ({
            user_id: item.user_id,
            type: "new_episode",
            title: "Yeni Bölüm",
            message: `${animeTitle} - ${episodeLabel} yayınlandı!`,
            link: `/watch/${animeId}/${episodeLabel.split(' ').pop()}`, // Basit link tahmini
            anime_id: animeId,
            is_read: false
        }));

        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) console.error("Toplu bildirim gönderilemedi:", error);
    }
}
