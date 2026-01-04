"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { createClient } from "@/shared/lib/supabase/server";
import { type CreateReportInput, createReportSchema } from "@/shared/lib/validations/api";
import type { ReportInsert } from "@/shared/types/helpers";

type ReportReason = 'playback' | 'audio' | 'subtitle' | 'wrong';

const RATE_LIMIT_WINDOW_HOURS = 1;
const RATE_LIMIT_MAX_REPORTS = 3;

export async function createReport(data: CreateReportInput) {
    return await safeAction(async () => {
        // Zod validation
        const validation = createReportSchema.safeParse(data);
        if (!validation.success) {
            throw new Error(validation.error.issues[0]?.message || "Geçersiz veri");
        }

        const validatedData = validation.data;
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

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
                .eq("anime_id", validatedData.animeId);

            if (validatedData.episodeNumber) {
                rateLimitQuery = rateLimitQuery.eq("episode_number", validatedData.episodeNumber);
            }
        }

        const { count: recentReports } = await rateLimitQuery;

        if ((recentReports || 0) >= RATE_LIMIT_MAX_REPORTS) {
            throw new Error(user
                ? "Çok fazla bildirim gönderdiniz. Lütfen 1 saat sonra tekrar deneyin."
                : "Bu içerik için çok fazla anonim bildirim gönderilmiş. Lütfen giriş yapın veya daha sonra tekrar deneyin.");
        }

        // Fetch anime title for normalized data
        const { data: anime, error: animeError } = await supabase
            .from('animes')
            .select('title')
            .eq('id', validatedData.animeId)
            .single();

        if (animeError || !anime) {
            throw new Error("Anime bulunamadı.");
        }

        const reportPayload: ReportInsert = {
            anime_id: validatedData.animeId,
            anime_title: anime.title,
            episode_number: validatedData.episodeNumber,
            season_number: validatedData.seasonNumber,
            reason: validatedData.reason as ReportReason,
            description: validatedData.description || null,
            user_id: user?.id || null,
            status: 'pending',
        };

        const { error } = await supabase.from("reports").insert(reportPayload);

        if (error) {
            throw new Error("Bildirim oluşturulurken bir hata oluştu.");
        }

        return { success: true };
    }, "createReport");
}
