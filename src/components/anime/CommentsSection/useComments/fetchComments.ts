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
    animeId: number,
    episodeId: number | undefined
): Promise<{ comments: Comment[]; totalCount: number }> {
    const supabase = createClient();

    let query = supabase
        .from("comments")
        .select("*")
        .eq("anime_id", animeId)
        .is("parent_id", null)
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

    const userIds = Array.from(new Set((commentsData || []).map(c => c.user_id)));
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

    const commentIds = (commentsData || []).map(c => c.id);
    const { data: repliesData } = commentIds.length > 0
        ? await supabase
            .from("comments")
            .select("*")
            .eq("anime_id", animeId)
            .in("parent_id", commentIds)
            .order("created_at", { ascending: true })
        : { data: null };

    const replyUserIds = Array.from(new Set((repliesData || []).map(r => r.user_id)));
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

    const repliesMap: Record<number, Reply[]> = {};
    (repliesData || []).forEach((reply) => {
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
            likes: reply.likes_count || 0,
            isSpoiler: reply.has_spoiler || false,
        });
    });

    const mappedComments: Comment[] = (commentsData || []).map((item) => {
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
            likes: item.likes_count || 0,
            isPinned: false,
            isSpoiler: item.has_spoiler || false,
            replies: repliesMap[item.id] || []
        };
    });

    return {
        comments: mappedComments,
        totalCount: totalCount || 0
    };
}