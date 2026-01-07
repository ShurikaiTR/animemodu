import { createClient } from "@/shared/lib/supabase/server";
import { type AnimeDataRaw, AnimeMapper } from "@/shared/mappers/anime-mapper";
import type { WatchStatus } from "@/shared/types/domain/watchlist";

interface ListItem {
    anime_id: string;
    id: string;
    user_id: string;
    status: string;
    score: number | null;
    created_at: string;
    updated_at: string;
}

export class WatchListService {
    static async updateWatchStatus(userId: string, animeId: string, status: WatchStatus | null) {
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
            const { data: existing } = await supabase
                .from("user_anime_list")
                .select("status")
                .eq("user_id", userId)
                .eq("anime_id", animeId)
                .maybeSingle();

            const { error } = await supabase
                .from("user_anime_list")
                .upsert(
                    { user_id: userId, anime_id: animeId, status: status, updated_at: new Date().toISOString() },
                    { onConflict: "user_id, anime_id" }
                );

            if (error) throw new Error(error.message);

            return {
                action: existing ? 'update' : 'add',
                oldStatus: (existing as { status: string } | null)?.status || null
            };
        }
    }

    static async checkWatchStatus(userId: string, animeId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("user_anime_list")
            .select("status")
            .eq("user_id", userId)
            .eq("anime_id", animeId)
            .maybeSingle();

        return (data as { status: string } | null)?.status || null;
    }

    static async getUserWatchList(userId: string) {
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

        const animesMap = new Map((animesData as AnimeDataRaw[]).map(a => [a.id, a]));

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
                    anime: AnimeMapper.toCard(anime)
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }
}
