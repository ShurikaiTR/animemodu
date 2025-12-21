import { createClient } from "@/lib/supabase/server";
import { CommentsTable, InteractionItem } from "@/components/panel/tables/CommentsTable";
import { handleSupabaseError } from "@/lib/panel/utils";

export async function CommentsContent() {
    const supabase = await createClient();

    const [commentsResult, reviewsResult] = await Promise.all([
        supabase
            .from("comments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50),
        supabase
            .from("reviews")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(50),
    ]);

    const comments = handleSupabaseError(commentsResult, "Yorumlar yüklenirken hata oluştu");
    const reviews = handleSupabaseError(reviewsResult, "İncelemeler yüklenirken hata oluştu");
    const animeIds = new Set<number>();
    const userIds = new Set<string>();
    comments.forEach((c) => {
        animeIds.add(c.anime_id);
        userIds.add(c.user_id);
    });
    reviews.forEach((r) => {
        animeIds.add(r.anime_id);
        userIds.add(r.user_id);
    });

    const [animesResult, profilesResult] = await Promise.all([
        supabase
            .from("animes")
            .select("id, title, slug")
            .in("id", Array.from(animeIds)),
        supabase
            .from("profiles")
            .select("id, username, avatar_url, role")
            .in("id", Array.from(userIds)),
    ]);

    const animes = handleSupabaseError(animesResult, "Anime bilgileri yüklenirken hata oluştu");
    const profiles = handleSupabaseError(profilesResult, "Kullanıcı bilgileri yüklenirken hata oluştu");

    const animeMap = new Map<number, { id: number; title: string; slug: string }>();
    animes.forEach((a) => animeMap.set(a.id, a));

    const profileMap = new Map<string, { id: string; username: string | null; avatar_url: string | null; role: "user" | "admin" }>();
    profiles.forEach((p) => profileMap.set(p.id, p));

    const commentItems: InteractionItem[] = comments.map((c) => {
        const profile = profileMap.get(c.user_id);
        const anime = animeMap.get(c.anime_id);
        return {
            id: c.id,
            type: "comment",
            content: c.content,
            user: profile
                ? {
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                }
                : null,
            anime: anime
                ? {
                    id: anime.id,
                    title: anime.title,
                    slug: anime.slug,
                }
                : null,
            created_at: c.created_at,
            is_spoiler: c.has_spoiler,
            likes_count: c.likes_count,
        };
    });

    const reviewItems: InteractionItem[] = reviews.map((r) => {
        const profile = profileMap.get(r.user_id);
        const anime = animeMap.get(r.anime_id);
        return {
            id: r.id,
            type: "review",
            content: r.content,
            user: profile
                ? {
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                }
                : null,
            anime: anime
                ? {
                    id: anime.id,
                    title: anime.title,
                    slug: anime.slug,
                }
                : null,
            created_at: r.created_at,
            is_spoiler: r.has_spoiler,
            rating: r.rating,
            likes_count: r.likes_count,
        };
    });

    const allItems = [...commentItems, ...reviewItems].sort(
        (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-rubik font-bold text-white mb-1">Yorumlar ve İncelemeler</h2>
                    <p className="text-text-main/60 text-sm">
                        Kullanıcıların yaptığı son yorumları ve incelemeleri buradan takip edebilirsin.
                    </p>
                </div>
            </div>
            <CommentsTable items={allItems} />
        </div>
    );
}
