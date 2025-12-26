"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReportInsert } from "@/types/helpers";

interface CreateReportData {
    animeId: string;
    episodeNumber?: number;
    seasonNumber?: number;
    reason: string;
    description?: string;
}

type ReportReason = 'playback' | 'audio' | 'subtitle' | 'wrong';

interface ReportPayload extends ReportInsert {
    anime_title: string;
}

const VALID_REASONS: ReportReason[] = ['playback', 'audio', 'subtitle', 'wrong'];
const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_REPORTS = 3;

function isValidReason(reason: string): reason is ReportReason {
    return VALID_REASONS.includes(reason as ReportReason);
}

export async function createReport(data: CreateReportData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!isValidReason(data.reason)) {
            return { success: false, error: "Geçersiz hata nedeni." };
        }

        // Rate limiting: Check reports in last hour
        const oneHourAgo = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();

        let rateLimitQuery = supabase
            .from("reports")
            .select("id", { count: "exact", head: true })
            .gte("created_at", oneHourAgo);

        if (user) {
            // Logged-in user: limit by user_id
            rateLimitQuery = rateLimitQuery.eq("user_id", user.id);
        } else {
            // Anonymous: limit by anime_id + episode to prevent spam on same content
            rateLimitQuery = rateLimitQuery
                .is("user_id", null)
                .eq("anime_id", data.animeId);

            if (data.episodeNumber) {
                rateLimitQuery = rateLimitQuery.eq("episode_number", data.episodeNumber);
            }
        }

        const { count: recentReports } = await rateLimitQuery;

        if ((recentReports || 0) >= RATE_LIMIT_MAX_REPORTS) {
            return {
                success: false,
                error: user
                    ? "Çok fazla bildirim gönderdiniz. Lütfen 1 saat sonra tekrar deneyin."
                    : "Bu içerik için çok fazla anonim bildirim gönderilmiş. Lütfen giriş yapın veya daha sonra tekrar deneyin."
            };
        }

        // Fetch anime title for normalized data
        const { data: anime, error: animeError } = await supabase
            .from('animes')
            .select('title')
            .eq('id', data.animeId)
            .single();

        if (animeError || !anime) {
            return { success: false, error: "Anime bulunamadı." };
        }

        // Type-safe extraction
        const animeTitle = (anime as unknown as { title: string }).title;

        const reportPayload: ReportPayload = {
            anime_id: data.animeId,
            episode_number: data.episodeNumber,
            season_number: data.seasonNumber,
            reason: data.reason as ReportReason,
            description: data.description || null,
            user_id: user?.id || null,
            status: 'pending',
            anime_title: animeTitle
        };

        const { error } = await supabase.from("reports").insert(reportPayload as never);

        if (error) {
            return { success: false, error: "Bildirim oluşturulurken bir hata oluştu." };
        }

        return { success: true };
    } catch {
        return { success: false, error: "Bildirim oluşturulurken bir hata oluştu." };
    }
}
