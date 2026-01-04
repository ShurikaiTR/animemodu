import { createClient } from "@/shared/lib/supabase/server";
import type { ReportInsert, ReportRow, ReportWithDetails } from "@/shared/types/helpers";

export class ReportService {
    /**
     * Create a new content report
     */
    static async create(payload: ReportInsert): Promise<ReportRow> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("reports")
            .insert(payload)
            .select()
            .single();

        if (error) throw error;
        return data;
    }

    /**
     * Get recent reports count for rate limiting
     */
    static async getRecentCount(params: {
        userId?: string | null,
        animeId?: string,
        episodeNumber?: number | null,
        since: string
    }): Promise<number> {
        const supabase = await createClient();
        let query = supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .gte("created_at", params.since);

        if (params.userId) {
            query = query.eq("user_id", params.userId);
        } else if (params.animeId) {
            query = query
                .is("user_id", null)
                .eq("anime_id", params.animeId);

            if (params.episodeNumber) {
                query = query.eq("episode_number", params.episodeNumber);
            }
        }

        const { count } = await query;
        return count || 0;
    }

    /**
     * Get paginated reports for admin panel
     */
    static async getAll(params: {
        page: number,
        pageSize: number,
        status?: string | null
    }): Promise<{ items: ReportWithDetails[], count: number }> {
        const supabase = await createClient();
        const from = (params.page - 1) * params.pageSize;
        const to = from + params.pageSize - 1;

        let query = supabase
            .from("reports")
            .select(`
                *,
                anime:animes!reports_anime_id_fkey(id, title, slug, poster_path)
            `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (params.status && params.status !== "all") {
            query = query.eq("status", params.status);
        }

        const { data: rawReports, error, count } = await query;
        if (error) throw error;

        // Fetch user profiles separately
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

        const items: ReportWithDetails[] = (rawReports || []).map(report => ({
            ...report,
            anime: report.anime as unknown as ReportWithDetails["anime"],
            user: report.user_id ? userMap[report.user_id] || null : null,
        }));

        return { items, count: count || 0 };
    }

    /**
     * Update report status
     */
    static async updateStatus(id: string, status: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("reports")
            .update({
                status,
                updated_at: new Date().toISOString()
            })
            .eq("id", id);

        if (error) throw error;
    }

    /**
     * Delete a report
     */
    static async delete(id: string): Promise<void> {
        const supabase = await createClient();
        const { error } = await supabase
            .from("reports")
            .delete()
            .eq("id", id);

        if (error) throw error;
    }
}
