import { createClient } from "@/shared/lib/supabase/server";
import type { NotificationInsert } from "@/shared/types/database-types";

/**
 * NotificationTriggerService - Bildirim tetikleme (dağıtma) işlemleri
 */
export class NotificationTriggerService {
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

        const { data: watchlistUsers, error: watchlistError } = await supabase
            .from("user_anime_list")
            .select("user_id")
            .eq("anime_id", animeId);

        if (watchlistError) throw watchlistError;
        if (!watchlistUsers || watchlistUsers.length === 0) return;

        const notifications: NotificationInsert[] = watchlistUsers.map(item => ({
            user_id: item.user_id,
            type: "new_episode",
            title: `${animeTitle} - Yeni Bölüm!`,
            message: episodeTitle,
            link: `/izle/${animeSlug}`,
            anime_id: animeId,
            episode_id: episodeId,
            is_read: false
        }));

        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) throw error;
    }

    /**
     * Basitleştirilmiş watchlist bildirimi (Episode ID olmadan)
     */
    static async notifyWatchlistUsersSimple(
        animeId: string,
        animeTitle: string,
        episodeLabel: string,
        animeSlug: string
    ): Promise<void> {
        const supabase = await createClient();

        const { data: watchlistUsers, error: watchlistError } = await supabase
            .from("user_anime_list")
            .select("user_id")
            .eq("anime_id", animeId);

        if (watchlistError) throw watchlistError;
        if (!watchlistUsers || watchlistUsers.length === 0) return;

        const notifications: NotificationInsert[] = watchlistUsers.map(item => ({
            user_id: item.user_id,
            type: "new_episode",
            title: `${animeTitle} - Yeni Bölüm!`,
            message: episodeLabel,
            link: `/izle/${animeSlug}`,
            anime_id: animeId,
            is_read: false
        }));

        const { error } = await supabase.from("notifications").insert(notifications);
        if (error) throw error;
    }
}
