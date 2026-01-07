import { createClient } from "@/shared/lib/supabase/server";
import { type AnimeDataRaw, AnimeMapper } from "@/shared/mappers/anime-mapper";

interface FavItem {
    id: string;
    anime_id: string;
    created_at: string;
}

export class FavoriteService {
    static async toggleFavorite(userId: string, animeId: string) {
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
    }

    static async checkFavorite(userId: string, animeId: string) {
        const supabase = await createClient();
        const { data } = await supabase
            .from("user_favorites")
            .select("id")
            .eq("user_id", userId)
            .eq("anime_id", animeId)
            .maybeSingle();

        return !!data;
    }

    static async getUserFavorites(userId: string) {
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

        const animesMap = new Map((animesData as AnimeDataRaw[]).map(a => [a.id, a]));

        return (favData as FavItem[])
            .map((item) => {
                const anime = animesMap.get(item.anime_id);
                if (!anime) return null;
                return {
                    id: item.id,
                    user_id: userId,
                    anime_id: item.anime_id,
                    created_at: item.created_at,
                    anime: AnimeMapper.toCard(anime)
                };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);
    }
}
