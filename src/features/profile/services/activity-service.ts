import { createClient, createPublicClient } from "@/shared/lib/supabase/server";
import type { Activity, ActivityMetadata, ActivityRow, ActivityType, Json } from "@/shared/types/helpers";

export class ActivityService {
    /**
     * Get user activities with anime details
     */
    static async getUserActivities(userId: string, limit = 20): Promise<Activity[]> {
        const supabase = createPublicClient();
        const { data: activities, error } = await supabase
            .from("user_activities")
            .select("*")
            .eq("user_id", userId)
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw error;
        if (!activities || activities.length === 0) return [];

        const typedActivities = activities as unknown as ActivityRow[];
        const animeIds = typedActivities.filter(a => a.anime_id).map(a => a.anime_id as string);

        let animesMap = new Map<string, { title: string; slug: string; poster_path: string | null }>();

        if (animeIds.length > 0) {
            const { data: animes } = await supabase
                .from("animes")
                .select("id, title, slug, poster_path")
                .in("id", animeIds);

            if (animes) {
                animesMap = new Map(animes.map(a => [a.id, { title: a.title, slug: a.slug, poster_path: a.poster_path }]));
            }
        }

        return typedActivities.map(activity => ({
            ...activity,
            anime: activity.anime_id ? animesMap.get(activity.anime_id) || null : null,
        } as Activity));
    }

    /**
     * Create a new activity
     */
    static async createActivity(params: {
        userId: string,
        activityType: ActivityType,
        animeId?: string | null,
        metadata?: ActivityMetadata
    }): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("user_activities")
            .insert({
                user_id: params.userId,
                activity_type: params.activityType,
                anime_id: params.animeId || null,
                metadata: (params.metadata || {}) as Json,
            });

        if (error) throw error;
    }
}
