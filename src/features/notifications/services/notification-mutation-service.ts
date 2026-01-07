import { createClient } from "@/shared/lib/supabase/server";
import type { CreateNotificationParams } from "@/shared/types/domain/notification";

export class NotificationMutationService {
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
            .from("user_anime_list")
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
