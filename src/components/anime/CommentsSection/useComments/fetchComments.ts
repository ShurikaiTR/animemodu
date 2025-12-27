import { createClient } from "@/lib/supabase/client";
import { formatDistanceToNow } from "date-fns";
import { tr } from "date-fns/locale";
import type { Comment, Reply } from "../types";
import { logError } from "@/lib/errors";

/** Profile query sonucu için interface */
interface ProfileData {
    id: string;
    username: string | null;
    avatar_url: string | null;
    role: string | null;
}

export async function fetchCommentsData(
    animeId: string,
    episodeId: string | undefined
): Promise<{ comments: Comment[]; totalCount: number }> {
    const supabase = createClient();

    let query = supabase
        .from("comments")
        .select("*")
        .eq("anime_id", animeId)
        .is("parent_id", null)
        .order("is_pinned", { ascending: false })
        .order("created_at", { ascending: false });

    let countQuery = supabase
        .from("comments")
        .select("*", { count: 'exact', head: true })
        .eq("anime_id", animeId);

    if (episodeId) {
        query = query.eq("episode_id", episodeId);
        countQuery = countQuery.eq("episode_id", episodeId);
    } else {
        query = query.is("episode_id", null);
        countQuery = countQuery.is("episode_id", null);
    }

    const [
        { data: commentsData, error: commentsError },
        { count: totalCount }
    ] = await Promise.all([
        query,
        countQuery
    ]);

    if (commentsError) {
        logError("fetchCommentsData", commentsError);
        return { comments: [], totalCount: 0 };
    }

    type CommentDataRow = { user_id: string; id: string; parent_id: string | null; content: string; created_at: string; like_count: number; is_spoiler: boolean; is_pinned: boolean };
    const userIds = Array.from(new Set((commentsData as CommentDataRow[] || []).map(c => c.user_id)));
    let profilesMap: Record<string, { username: string; avatar_url: string | null; role: string }> = {};

    if (userIds.length > 0) {
        const { data: profilesData } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, role")
            .in("id", userIds);

        if (profilesData) {
            (profilesData as ProfileData[]).forEach(p => {
                profilesMap[p.id] = {
                    username: p.username || "Kullanıcı",
                    avatar_url: p.avatar_url,
                    role: p.role || "user"
                };
            });
        }
    }

    const commentIds = ((commentsData || []) as CommentDataRow[]).map(c => c.id);
    const { data: repliesData } = commentIds.length > 0
        ? await supabase
            .from("comments")
            .select("*")
            .eq("anime_id", animeId)
            .in("parent_id", commentIds)
            .order("created_at", { ascending: true })
        : { data: null };

    const replyUserIds = Array.from(new Set(((repliesData || []) as CommentDataRow[]).map(r => r.user_id)));
    if (replyUserIds.length > 0) {
        const { data: replyProfilesData } = await supabase
            .from("profiles")
            .select("id, username, avatar_url, role")
            .in("id", replyUserIds);

        if (replyProfilesData) {
            (replyProfilesData as ProfileData[]).forEach(p => {
                profilesMap[p.id] = {
                    username: p.username || "Kullanıcı",
                    avatar_url: p.avatar_url,
                    role: p.role || "user"
                };
            });
        }
    }

    const repliesMap: Record<string, Reply[]> = {};
    ((repliesData || []) as CommentDataRow[]).forEach((reply) => {
        if (!repliesMap[reply.parent_id!]) {
            repliesMap[reply.parent_id!] = [];
        }
        const profile = profilesMap[reply.user_id];
        repliesMap[reply.parent_id!].push({
            id: reply.id,
            author: profile?.username || "Anonim",
            username: profile?.username || "anonim",
            role: profile?.role === "admin" ? "Admin" : "Üye",
            avatarUrl: profile?.avatar_url || null,
            avatarColor: "from-primary to-blue-600",
            timeAgo: formatDistanceToNow(new Date(reply.created_at), { addSuffix: true, locale: tr }),
            content: reply.content,
            likes: reply.like_count || 0,
            isSpoiler: reply.is_spoiler || false,
        });
    });

    const mappedComments: Comment[] = ((commentsData || []) as CommentDataRow[]).map((item) => {
        const profile = profilesMap[item.user_id];
        return {
            id: item.id,
            author: profile?.username || "Anonim",
            username: profile?.username || "anonim",
            role: profile?.role === "admin" ? "Admin" : "Üye",
            avatarUrl: profile?.avatar_url || null,
            avatarColor: "from-primary to-blue-600",
            timeAgo: formatDistanceToNow(new Date(item.created_at), { addSuffix: true, locale: tr }),
            content: item.content,
            likes: item.like_count || 0,
            isPinned: item.is_pinned || false,
            isSpoiler: item.is_spoiler || false,
            replies: repliesMap[item.id] || []
        };
    });

    return {
        comments: mappedComments,
        totalCount: totalCount || 0
    };
}