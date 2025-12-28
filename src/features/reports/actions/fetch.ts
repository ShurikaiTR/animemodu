"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import type { ReportWithDetails } from "@/shared/types/helpers";

const PAGE_SIZE = 20;

type GetReportsResult = {
    success: boolean;
    error?: string;
    data: ReportWithDetails[];
    totalPages: number;
};

export async function getReports(page = 1, status: string | null = null): Promise<GetReportsResult> {
    try {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            return { success: false, error: auth.error, data: [], totalPages: 0 };
        }

        const supabase = await createClient();
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        // Fetch reports with anime relation
        let query = supabase
            .from("reports")
            .select(`
                *,
                anime:animes!reports_anime_id_fkey(id, title, slug, poster_path)
            `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data: rawReports, error, count } = await query;

        if (error) {
            return { success: false, error: "Bildirimler alınamadı.", data: [], totalPages: 0 };
        }

        // Fetch user profiles separately for reports that have user_id
        const userIds = (rawReports || [])
            .map(r => r.user_id)
            .filter((id): id is string => id !== null);

        const uniqueUserIds = [...new Set(userIds)];

        let userMap: Record<string, { username: string; avatar_url: string | null }> = {};

        if (uniqueUserIds.length > 0) {
            const { data: users } = await supabase
                .from("profiles")
                .select("id, username, avatar_url")
                .in("id", uniqueUserIds);

            if (users) {
                userMap = Object.fromEntries(
                    users.map(u => [u.id, { username: u.username || 'Anonim', avatar_url: u.avatar_url }])
                );
            }
        }

        // Combine reports with user data
        const reports: ReportWithDetails[] = (rawReports || []).map(report => ({
            id: report.id,
            anime_id: report.anime_id,
            anime_title: report.anime_title,
            episode_id: report.episode_id,
            episode_number: report.episode_number,
            season_number: report.season_number,
            user_id: report.user_id,
            reason: report.reason,
            description: report.description,
            status: report.status,
            created_at: report.created_at,
            updated_at: report.updated_at,
            anime: report.anime as { id: string; title: string; slug: string; poster_path: string | null } | null,
            user: report.user_id ? userMap[report.user_id] || null : null,
        }));

        return {
            success: true,
            data: reports,
            totalPages: Math.ceil((count || 0) / PAGE_SIZE)
        };

    } catch {
        return { success: false, error: "Beklenmeyen bir hata oluştu.", data: [], totalPages: 0 };
    }
}
