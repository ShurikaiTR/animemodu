import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { Review } from "../types";
import { logError } from "@/lib/errors";

export async function fetchReviewsData(animeId: number): Promise<{ reviews: Review[]; totalCount: number }> {
    const supabase = createClient();

    const { data: reviewsData, error: reviewsError, count } = await supabase
        .from("reviews")
        .select("*", { count: 'exact' })
        .eq("anime_id", animeId)
        .order("created_at", { ascending: false });

    if (reviewsError) {
        logError("fetchReviewsData", reviewsError);
        return { reviews: [], totalCount: 0 };
    }

    const userIds = Array.from(new Set((reviewsData || []).map(r => r.user_id)));
    let profilesMap: Record<string, { username: string; avatar_url: string | null; role: string }> = {};

    if (userIds.length > 0) {
        const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, role")
            .in("id", userIds);

        if (profilesData) {
            profilesData.forEach(p => {
                profilesMap[p.id] = {
                    username: p.username || "Kullanıcı",
                    avatar_url: p.avatar_url,
                    role: p.role || "user"
                };
            });
        }
    }

    const mappedReviews: Review[] = (reviewsData || []).map((item) => {
        const profile = profilesMap[item.user_id];

        return {
            id: item.id,
            author: profile?.username || "Eleştirmen",
            role: profile?.role === "admin" ? "Admin" : "Üye",
            avatarUrl: profile?.avatar_url || null,
            avatarColor: "from-purple-500 to-pink-600",
            timeAgo: formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: tr }),
            title: item.title || "",
            content: item.content,
            rating: item.rating || 0,
            helpfulCount: item.likes_count || 0,
            isVerified: false
        };
    });

    return {
        reviews: mappedReviews,
        totalCount: count || 0
    };
}









