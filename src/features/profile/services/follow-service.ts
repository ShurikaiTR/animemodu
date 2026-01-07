import { createClient } from "@/shared/lib/supabase/server";

export class FollowService {
    static async getFollowStatus(followerId: string, followingId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("user_follows")
            .select("id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return !!data;
    }

    static async toggleFollow(followerId: string, followingId: string) {
        const supabase = await createClient();

        const { data: existingFollow, error: checkError } = await supabase
            .from("user_follows")
            .select("id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (checkError) throw new Error(checkError.message);

        if (existingFollow) {
            const { error } = await supabase
                .from("user_follows")
                .delete()
                .eq("id", existingFollow.id);

            if (error) throw new Error("Takip bırakılamadı: " + error.message);
            return { isFollowing: false };
        } else {
            const { error } = await supabase
                .from("user_follows")
                .insert({ follower_id: followerId, following_id: followingId });

            if (error) throw new Error("Takip edilemedi: " + error.message);
            return { isFollowing: true };
        }
    }

    static async getFollowCounts(userId: string) {
        const supabase = await createClient();

        const [{ count: followersCount, error: followersError }, { count: followingCount, error: followingError }] = await Promise.all([
            supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("following_id", userId),
            supabase.from("user_follows").select("*", { count: "exact", head: true }).eq("follower_id", userId)
        ]);

        if (followersError) throw new Error("Takipçi sayısı alınamadı");
        if (followingError) throw new Error("Takip edilen sayısı alınamadı");

        return {
            followers: followersCount || 0,
            following: followingCount || 0,
        };
    }
}
