import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";

import { createClient } from "@/shared/lib/supabase/server";
import { type Comment, type Reply } from "@/shared/types/domain/interaction";
import type { CommentRow, ProfileRow } from "@/shared/types/helpers";

export class CommentQueryService {
    /**
     * Fetch comments for an anime or episode
     */
    static async getComments(animeId: string, episodeId?: string): Promise<{ comments: Comment[]; totalCount: number }> {
        const supabase = await createClient();

        let query = supabase
            .from("comments")
            .select("*", { count: "exact" })
            .eq("anime_id", animeId)
            .is("parent_id", null)
            .order("is_pinned", { ascending: false })
            .order("created_at", { ascending: false });

        if (episodeId) {
            query = query.eq("episode_id", episodeId);
        } else {
            query = query.is("episode_id", null);
        }

        const { data: commentsRow, error: commentsError, count } = await query;

        if (commentsError) throw new Error(commentsError.message);
        if (!commentsRow) return { comments: [], totalCount: 0 };

        const commentIds = commentsRow.map(c => c.id);
        const userIds = Array.from(new Set(commentsRow.map(c => c.user_id)));

        // Fetch replies
        const { data: repliesRow } = commentIds.length > 0
            ? await supabase
                .from("comments")
                .select("*")
                .in("parent_id", commentIds)
                .order("created_at", { ascending: true })
            : { data: [] };

        if (repliesRow) {
            repliesRow.forEach(r => userIds.push(r.user_id));
        }

        // Fetch profiles
        const uniqueUserIds = Array.from(new Set(userIds));
        const { data: profiles } = uniqueUserIds.length > 0
            ? await supabase
                .from("profiles")
                .select("id, username, avatar_url, role")
                .in("id", uniqueUserIds)
            : { data: [] };

        const profileMap = new Map<string, ProfileRow>();
        profiles?.forEach(p => profileMap.set(p.id, p as ProfileRow));

        // Group replies
        const repliesMap = new Map<string, Reply[]>();
        repliesRow?.forEach(r => {
            const profile = profileMap.get(r.user_id);
            const reply: Reply = {
                id: r.id,
                author: profile?.username || "Anonim",
                username: profile?.username || "anonim",
                role: profile?.role === "admin" ? "Admin" : "Üye",
                avatarUrl: profile?.avatar_url || null,
                avatarColor: "from-primary to-blue-600",
                timeAgo: formatDistanceToNow(new Date(r.created_at || ""), { addSuffix: true, locale: tr }),
                content: r.content,
                likes: r.like_count || 0,
                isSpoiler: r.is_spoiler || false,
            };

            const existing = repliesMap.get(r.parent_id!) || [];
            repliesMap.set(r.parent_id!, [...existing, reply]);
        });

        // Map comments
        const comments = commentsRow.map(c => {
            const profile = profileMap.get(c.user_id);
            return {
                id: c.id,
                author: profile?.username || "Anonim",
                username: profile?.username || "anonim",
                role: profile?.role === "admin" ? "Admin" : "Üye",
                avatarUrl: profile?.avatar_url || null,
                avatarColor: "from-primary to-blue-600",
                timeAgo: formatDistanceToNow(new Date(c.created_at || ""), { addSuffix: true, locale: tr }),
                content: c.content,
                likes: c.like_count || 0,
                isPinned: c.is_pinned || false,
                isSpoiler: c.is_spoiler || false,
                replies: repliesMap.get(c.id) || [],
            };
        });

        return { comments, totalCount: count || 0 };
    }

    /**
     * Fetch all comments for admin panel
     */
    static async getAllComments(limit = 50): Promise<CommentRow[]> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("comments")
            .select("*")
            .order("created_at", { ascending: false })
            .limit(limit);

        if (error) throw new Error(error.message);
        return data || [];
    }
}
