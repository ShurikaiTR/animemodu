import { createClient, createPublicClient } from "@/shared/lib/supabase/server";
import type {
    CreateNotificationParams,
    Notification,
    NotificationRow,
} from "@/shared/types/domain/notification";

/**
 * Notification Service - Bildirim işlemleri için servis sınıfı
 * 
 * NOT: `notifications` tablosu henüz Supabase types'a eklenmediğinden
 * type assertion kullanılmaktadır. Tablo oluşturulduktan sonra
 * `npx supabase gen types` komutuyla types güncellenmelidir.
 */
export class NotificationService {
    /**
     * Kullanıcının bildirimlerini getir (zenginleştirilmiş)
     */
    static async getUserNotifications(userId: string, limit = 20): Promise<Notification[]> {
        const supabase = createPublicClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { data: notifications, error } = await (supabase as any)
            .from("notifications")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (!notifications || notifications.length === 0) return [];

        const typedNotifications = notifications as NotificationRow[];

        // Anime bilgilerini zenginleştir
        const animeIds = typedNotifications
            .filter(n => n.anime_id)
            .map(n => n.anime_id as string);

        // Actor (aksiyonu yapan kullanıcı) bilgilerini zenginleştir
        const actorIds = typedNotifications
            .filter(n => n.actor_id)
            .map(n => n.actor_id as string);

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
        const supabase = createPublicClient();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { count, error } = await (supabase as any)
            .from("notifications")
            .select("*", { count: "exact", head: true })
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
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
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
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
            });

        if (error) throw error;
    }

    /**
     * Bir animeyi listesine eklemiş tüm kullanıcılara yeni bölüm bildirimi gönder
     */
    static async notifyWatchlistUsers(
        animeId: string,
        episodeId: string,
        animeTitle: string,
        episodeTitle: string,
        animeSlug: string
    ): Promise<void> {
        const supabase = await createClient();

        // Bu animeyi listesine eklemiş kullanıcıları bul
        const { data: watchlistUsers, error: watchlistError } = await supabase
            .from("user_anime_list")
            .select("user_id")
            .eq("anime_id", animeId);

        if (watchlistError) throw watchlistError;
        if (!watchlistUsers || watchlistUsers.length === 0) return;

        // Toplu bildirim oluştur
        const notifications = watchlistUsers.map(item => ({
            user_id: item.user_id,
            type: "new_episode" as const,
            title: `${animeTitle} - Yeni Bölüm!`,
            message: episodeTitle,
            link: `/izle/${animeSlug}`,
            anime_id: animeId,
            episode_id: episodeId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("notifications")
            .insert(notifications);

        if (error) throw error;
    }

    /**
     * Bir animeyi listesine eklemiş tüm kullanıcılara yeni bölüm bildirimi gönder
     * (Episode ID olmadan basitleştirilmiş versiyon)
     */
    static async notifyWatchlistUsersSimple(
        animeId: string,
        animeTitle: string,
        episodeLabel: string,
        animeSlug: string
    ): Promise<void> {
        const supabase = await createClient();

        // Bu animeyi listesine eklemiş kullanıcıları bul
        const { data: watchlistUsers, error: watchlistError } = await supabase
            .from("user_anime_list")
            .select("user_id")
            .eq("anime_id", animeId);

        if (watchlistError) throw watchlistError;
        if (!watchlistUsers || watchlistUsers.length === 0) return;

        // Toplu bildirim oluştur
        const notifications = watchlistUsers.map(item => ({
            user_id: item.user_id,
            type: "new_episode" as const,
            title: `${animeTitle} - Yeni Bölüm!`,
            message: episodeLabel,
            link: `/izle/${animeSlug}`,
            anime_id: animeId,
        }));

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const { error } = await (supabase as any)
            .from("notifications")
            .insert(notifications);

        if (error) throw error;
    }
}

