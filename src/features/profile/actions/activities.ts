"use server";

import { revalidatePath } from "next/cache";

import { isAuthError,requireUser } from "@/shared/lib/auth/guards";
import { logError } from "@/shared/lib/errors";
import { createClient, createPublicClient } from "@/shared/lib/supabase/server";
import type { Activity, ActivityMetadata, ActivityRow,ActivityType } from "@/shared/types/helpers";

/** Aktivite sonuç tipi */
type ActivitiesResult =
    | { success: true; data: Activity[] }
    | { success: false; error: string };

/**
 * Kullanıcının son aktivitelerini getirir
 * Public data - auth gerektirmez
 */
export async function getUserActivities(userId: string, limit = 20): Promise<ActivitiesResult> {
    const supabase = createPublicClient();

    // Type casting gerekli - user_activities tablosu henüz Supabase types'ta yok
    const { data: activities, error } = await (supabase.from("user_activities" as "animes") as ReturnType<typeof supabase.from>)
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(limit);

    if (error) {
        logError("getUserActivities", error);
        return { success: false, error: error.message };
    }

    if (!activities || activities.length === 0) {
        return { success: true, data: [] };
    }

    // Anime bilgilerini çek (anime_id olanlar için)
    const typedActivities = activities as unknown as ActivityRow[];
    const animeIds = typedActivities.filter(a => a.anime_id).map(a => a.anime_id as string);

    let animesMap = new Map<string, { title: string; slug: string; poster_path: string | null }>();

    if (animeIds.length > 0) {
        const { data: animes } = await supabase.from("animes").select("id, title, slug, poster_path").in("id", animeIds);
        if (animes) {
            animesMap = new Map(animes.map(a => [a.id, { title: a.title, slug: a.slug, poster_path: a.poster_path }]));
        }
    }

    // Aktiviteleri anime bilgileriyle birleştir
    const enrichedActivities: Activity[] = typedActivities.map(activity => ({
        ...activity,
        anime: activity.anime_id ? animesMap.get(activity.anime_id) || null : null,
    }));

    return { success: true, data: enrichedActivities };
}

/**
 * Yeni aktivite oluşturur (internal helper)
 * Diğer server action'lardan çağrılır
 */
export async function createActivity(
    activityType: ActivityType,
    animeId: string | null = null,
    metadata: ActivityMetadata = {}
) {
    const auth = await requireUser();
    if (isAuthError(auth)) return { success: false, error: auth.error };

    const supabase = await createClient();

    // Type casting gerekli - user_activities tablosu henüz Supabase types'ta yok
    const { error } = await (supabase.from("user_activities" as "animes") as ReturnType<typeof supabase.from>)
        .insert({
            user_id: auth.userId,
            activity_type: activityType,
            anime_id: animeId,
            metadata,
        } as Record<string, unknown>);

    if (error) {
        logError("createActivity", error);
        return { success: false, error: error.message };
    }

    // Aktivite cache'ini invalidate et
    if (auth.username) {
        revalidatePath(`/profil/${auth.username}`);
    }

    return { success: true };
}
