"use server";

import { AnimeService } from "@/features/anime/services/anime-service";
import { safeAction } from "@/shared/lib/actions/wrapper";
import { createClient } from "@/shared/lib/supabase/server";
import { type CreateReportInput, createReportSchema } from "@/shared/lib/validations/api";

import { ReportService } from "../services/report-service";

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
        const since = new Date(Date.now() - RATE_LIMIT_WINDOW_HOURS * 60 * 60 * 1000).toISOString();
        const recentReports = await ReportService.getRecentCount({
            userId: user?.id,
            animeId: validatedData.animeId,
            episodeNumber: validatedData.episodeNumber,
            since
        });

        if (recentReports >= RATE_LIMIT_MAX_REPORTS) {
            throw new Error(user
                ? "Çok fazla bildirim gönderdiniz. Lütfen 1 saat sonra tekrar deneyin."
                : "Bu içerik için çok fazla anonim bildirim gönderilmiş. Lütfen giriş yapın veya daha sonra tekrar deneyin.");
        }

        // Fetch anime title for normalized data
        const anime = await AnimeService.getById(validatedData.animeId);
        if (!anime) {
            throw new Error("Anime bulunamadı.");
        }

        await ReportService.create({
            anime_id: validatedData.animeId,
            anime_title: anime.title,
            episode_number: validatedData.episodeNumber,
            season_number: validatedData.seasonNumber,
            reason: validatedData.reason,
            description: validatedData.description || null,
            user_id: user?.id || null,
            status: 'pending',
        });

        return { success: true };
    }, "createReport");
}
