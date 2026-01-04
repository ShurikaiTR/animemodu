import { createClient } from "@/shared/lib/supabase/server";
import { getImageUrl } from "@/shared/lib/tmdb/utils";
import type { WatchStatus } from "@/shared/types/domain/watchlist";

// Internal types for mapped data
interface FavItem { id: string; anime_id: string; created_at: string; }
interface AnimeData { id: string; title: string; slug: string; poster_path: string | null; vote_average: number | null; release_date: string | null; genres: string[] | null; }
interface ListItem { anime_id: string; id: string; user_id: string; status: string; score: number | null; created_at: string; updated_at: string; }

export const ProfileService = {
    // --- Favorites ---

    async toggleFavorite(userId: string, animeId: string) {
        const supabase = await createClient();

        const { data: existing } = await supabase
            .from("user_favorites")
            .select("id")
            .eq("user_id", userId)
            .eq("anime_id", animeId)
            .maybeSingle();

        if (existing) {
            const { error } = await supabase
                .from("user_favorites")
                .delete()
                .eq("user_id", userId)
                .eq("anime_id", animeId);

            if (error) throw new Error(error.message);
            return { isFavorite: false };
        } else {
            const { error } = await supabase
                .from("user_favorites")
                .insert({ user_id: userId, anime_id: animeId });

            if (error) throw new Error(error.message);
            return { isFavorite: true };
        }
    },

    async checkFavorite(userId: string, animeId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("user_favorites")
            .select("id")
            .eq("user_id", userId)
            .eq("anime_id", animeId)
            .maybeSingle();

        return !!data;
    },

    async getUserFavorites(userId: string) {
        const supabase = await createClient();
        const { data: favData, error: favError } = await supabase
            .from("user_favorites")
            .select("id, anime_id, created_at")
            .eq("user_id", userId)
            .order("created_at", { ascending: false });

        if (favError) throw new Error(favError.message);
        if (!favData || favData.length === 0) return [];

        const animeIds = (favData as FavItem[]).map(item => item.anime_id);
        const { data: animesData, error: animesError } = await supabase
            .from("animes")
            .select("id, title, slug, poster_path, vote_average, release_date, genres")
            .in("id", animeIds);

        if (animesError) throw new Error(animesError.message);

        const animesMap = new Map((animesData as AnimeData[]).map(a => [a.id, a]));

        return (favData as FavItem[])
            .map((item) => {
                const anime = animesMap.get(item.anime_id);
                if (!anime) return null;
                return {
                    id: item.id,
                    user_id: userId,
                    anime_id: item.anime_id,
                    created_at: item.created_at,
                    anime: {
                        id: anime.id,
                        title: anime.title,
                        slug: anime.slug,
                        poster_url: getImageUrl(anime.poster_path, "w500") || "",
                        score: anime.vote_average,
                        release_year: anime.release_date ? new Date(anime.release_date).getFullYear() : 0,
                        genres: anime.genres
                    }
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    },

    // --- WatchList ---

    async updateWatchStatus(userId: string, animeId: string, status: WatchStatus | null) {
        const supabase = await createClient();

        if (status === null) {
            const { error } = await supabase
                .from("user_anime_list")
                .delete()
                .eq("user_id", userId)
                .eq("anime_id", animeId);

            if (error) throw new Error(error.message);
            return { action: 'remove', oldStatus: null };
        } else {
            // Check existing for activity tracking purposes
            const { data: existing } = await supabase
                .from("user_anime_list")
                .select("status")
                .eq("user_id", userId)
                .eq("anime_id", animeId)
                .maybeSingle();

            const { error } = await (supabase.from("user_anime_list") as ReturnType<typeof supabase.from>)
                .upsert(
                    { user_id: userId, anime_id: animeId, status: status, updated_at: new Date().toISOString() } as Record<string, unknown>,
                    { onConflict: "user_id, anime_id" }
                );

            if (error) throw new Error(error.message);

            return {
                action: existing ? 'update' : 'add',
                oldStatus: (existing as { status: string } | null)?.status
            };
        }
    },

    async checkWatchStatus(userId: string, animeId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("user_anime_list")
            .select("status")
            .eq("user_id", userId)
            .eq("anime_id", animeId)
            .maybeSingle();

        return (data as { status: string } | null)?.status || null;
    },

    async getUserWatchList(userId: string) {
        const supabase = await createClient();
        const { data: listData, error: listError } = await supabase
            .from("user_anime_list")
            .select("*")
            .eq("user_id", userId)
            .order("updated_at", { ascending: false });

        if (listError) throw new Error(listError.message);
        if (!listData || listData.length === 0) return [];

        const animeIds = (listData as ListItem[]).map(item => item.anime_id);
        const { data: animesData, error: animesError } = await supabase
            .from("animes")
            .select("id, title, slug, poster_path, vote_average, release_date, genres")
            .in("id", animeIds);

        if (animesError) throw new Error(animesError.message);

        const animesMap = new Map((animesData as AnimeData[]).map(a => [a.id, a]));

        return (listData as ListItem[])
            .map((item) => {
                const anime = animesMap.get(item.anime_id);
                if (!anime) return null;
                return {
                    id: item.id,
                    user_id: item.user_id,
                    anime_id: item.anime_id,
                    status: item.status as WatchStatus,
                    score: item.score,
                    created_at: item.created_at,
                    updated_at: item.updated_at,
                    anime: {
                        id: anime.id,
                        title: anime.title,
                        slug: anime.slug,
                        poster_url: getImageUrl(anime.poster_path, "w500") || "",
                        score: anime.vote_average,
                        release_year: anime.release_date ? new Date(anime.release_date).getFullYear() : 0,
                        genres: anime.genres
                    }
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    },

    // --- Follow System ---

    async getFollowStatus(followerId: string, followingId: string) {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("user_follows")
            .select("id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (error) throw new Error(error.message);
        return !!data;
    },

    async toggleFollow(followerId: string, followingId: string) {
        const supabase = await createClient();

        // Check existing
        const { data: existingFollow, error: checkError } = await supabase
            .from("user_follows")
            .select("id")
            .eq("follower_id", followerId)
            .eq("following_id", followingId)
            .maybeSingle();

        if (checkError) throw new Error(checkError.message);

        // Get profiles for return data / activity metadata if needed (can be handled in action too, but let's return usernames here for convenience if needed)
        // Ideally mapped in service, but let's keep it simple: Service does DB ops.

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
    },

    async getFollowCounts(userId: string) {
        const supabase = await createClient();

        const { count: followersCount, error: followersError } = await supabase
            .from("user_follows")
            .select("*", { count: "exact", head: true })
            .eq("following_id", userId);

        if (followersError) throw new Error("Takipçi sayısı alınamadı");

        const { count: followingCount, error: followingError } = await supabase
            .from("user_follows")
            .select("*", { count: "exact", head: true })
            .eq("follower_id", userId);

        if (followingError) throw new Error("Takip edilen sayısı alınamadı");

        return {
            followers: followersCount || 0,
            following: followingCount || 0,
        };
    },

    // Helper to get basic profile infos for activity
    async getProfileBasic(userId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("profiles")
            .select("username")
            .eq("id", userId)
            .single();
        return data;
    }
};
