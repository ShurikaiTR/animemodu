"use server";

import { createClient } from "@/lib/supabase/server";
import type { ReportInsert } from "@/types/helpers";

interface CreateReportData {
    animeId: number;
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
