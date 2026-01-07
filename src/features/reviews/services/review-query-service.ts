import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import { createClient } from "@/shared/lib/supabase/server";
import { type Review } from "@/shared/types/domain/interaction";
import type { ProfileRow, ReviewRow } from "@/shared/types/helpers";

export class ReviewQueryService {
    /**
     * Fetch reviews for an anime
     */
    static async getReviews(animeId: string): Promise<{ reviews: Review[]; totalCount: number }> {
        const supabase = await createClient();

        const { data: reviewsRow, error, count } = await supabase
            .from("reviews")
            .select("*", { count: "exact" })
            .eq("anime_id", animeId)
            .order("created_at", { ascending: false });

        if (error) throw new Error(error.message);
        if (!reviewsRow) return { reviews: [], totalCount: 0 };

        const userIds = Array.from(new Set(reviewsRow.map(r => r.user_id)));

        // Fetch profiles
        const { data: profiles } = userIds.length > 0
            ? await supabase
                .from("profiles")
                .select("id, username, avatar_url, role")
                .in("id", userIds)
            : { data: [] };

        const profileMap = new Map<string, ProfileRow>();
        profiles?.forEach(p => profileMap.set(p.id, p as ProfileRow));

        const reviews = reviewsRow.map(item => {
            const profile = profileMap.get(item.user_id);

            return {
                id: item.id,
                author: profile?.username || "Eleştirmen",
                role: profile?.role === "admin" ? "Admin" : "Üye",
                avatarUrl: profile?.avatar_url || null,
                avatarColor: "from-purple-500 to-pink-600",
                timeAgo: formatDistanceToNow(new Date(item.created_at || ""), { addSuffix: true, locale: tr }),
                title: item.title || "",
                content: item.content,
                rating: item.rating || 0,
                helpfulCount: item.helpful_count || 0,
                isVerified: false
            };
        });

        return { reviews, totalCount: count || 0 };
    }

    /**
     * Fetch all reviews for admin panel
     */
    static async getAllReviews(limit = 50): Promise<ReviewRow[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);
        return data || [];
    }

    /**
     * Get user's review for an anime
     */
    static async getUserReview(animeId: string, userId: string): Promise<ReviewRow | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("reviews")
            .select("*")
            .eq("anime_id", animeId)
            .eq("user_id", userId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return data;
    }
}
