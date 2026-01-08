import { CommentsTable, InteractionItem } from "@/components/panel/tables/CommentsTable";
import { CommentQueryService } from "@/features/comments/services/comment-query-service";
import { ReviewQueryService } from "@/features/reviews/services/review-query-service";
import { createClient } from "@/shared/lib/supabase/server";

export async function CommentsContent() {
    try {
        const [comments, reviews] = await Promise.all([
            CommentQueryService.getAllComments(50),
            ReviewQueryService.getAllReviews(50),
        ]);

        const supabase = await createClient();
        const animeIds = new Set<string>();
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

        const animes = animesResult.data || [];
        const profiles = profilesResult.data || [];

        const animeMap = new Map(animes.map(a => [a.id, a]));
        const profileMap = new Map(profiles.map(p => [p.id, { ...p, role: p.role as "user" | "admin" }]));

        const commentItems: InteractionItem[] = comments.map((c) => {
            const profile = profileMap.get(c.user_id);
            const anime = animeMap.get(c.anime_id);
            return {
                id: c.id,
                type: "comment",
                content: c.content,
                user: profile ? {
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                } : null,
                anime: anime ? {
                    id: anime.id,
                    title: anime.title,
                    slug: anime.slug,
                } : null,
                created_at: c.created_at || "",
                is_spoiler: c.is_spoiler || false,
                likes_count: c.like_count || 0,
            };
        });

        const reviewItems: InteractionItem[] = reviews.map((r) => {
            const profile = profileMap.get(r.user_id);
            const anime = animeMap.get(r.anime_id);
            return {
                id: r.id,
                type: "review",
                content: r.content,
                user: profile ? {
                    username: profile.username,
                    avatar_url: profile.avatar_url,
                    role: profile.role,
                } : null,
                anime: anime ? {
                    id: anime.id,
                    title: anime.title,
                    slug: anime.slug,
                } : null,
                created_at: r.created_at || "",
                is_spoiler: r.is_spoiler || false,
                rating: r.rating || 0,
                likes_count: r.helpful_count || 0,
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
    } catch (error) {
        return (
            <div className="p-8 text-center bg-red-500/10 border border-red-500/20 rounded-2xl">
                <p className="text-red-500 font-medium">Yükleme sırasında bir hata oluştu.</p>
                <p className="text-red-500/60 text-sm mt-1">{error instanceof Error ? error.message : "Bilinmeyen hata"}</p>
            </div>
        );
    }
}
