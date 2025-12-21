
"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import type { ReportInsert, ReportWithDetails } from "@/types/helpers";

interface CreateReportData {
    animeId: number;
    episodeNumber?: number;
    seasonNumber?: number;
    reason: string;
    description?: string;
}

export async function createReport(data: CreateReportData) {
    try {
        const supabase = await createClient();
        const { data: { user } } = await supabase.auth.getUser();

        // Validate reason
        const validReasons = ['playback', 'audio', 'subtitle', 'wrong'];
        if (!validReasons.includes(data.reason)) {
            return { success: false, error: "Geçersiz hata nedeni." };
        }

        const reportData: ReportInsert = {
            anime_id: data.animeId,
            episode_number: data.episodeNumber,
            season_number: data.seasonNumber,
            reason: data.reason as any,
            description: data.description || null,
            user_id: user?.id || null, // Allow anonymous or logged in
            status: 'pending'
        };

        // We need anime_title for normalized data if I decided to keep it?
        // Wait, I removed `anime_title` from SQL in step 837?
        // Let's re-read step 837 SQL.
        // Yes: `anime_title text not null` was in the SQL provided in Step 837.
        // BUT I commented `Foreign key exists... Let's use anime_id. Wait... ReportModal has animeTitle prop.`
        // THEN I wrote: `anime_id bigint not null references public.animes(id)...`
        // AND `anime_title text not null` IS in the SQL I wrote in Step 837.
        // So I MUST provide `anime_title`.
        // To get `anime_title`, I should query it or pass it from client.
        // Querying is safer.
        const { data: anime } = await supabase.from('animes').select('title').eq('id', data.animeId).single();

        if (!anime) {
            return { success: false, error: "Anime bulunamadı." };
        }

        const reportPayload: any = { ...reportData, anime_title: (anime as { title: string }).title };

        const { error } = await supabase.from("reports").insert(reportPayload);

        if (error) {
            console.error("Report create error:", error);
            return { success: false, error: "Bildirim oluşturulurken bir hata oluştu." };
        }

        return { success: true };
    } catch (error) {
        console.error("Report create error:", error);
        return { success: false, error: "Bildirim oluşturulurken bir hata oluştu." };
    }
}

export async function getReports(page = 1, status: string | null = null) {
    try {
        const auth = await requireAdmin();
        if (isAuthError(auth)) return { success: false, error: auth.error, data: [], totalPages: 0 };

        const supabase = await createClient();
        const PAGE_Size = 20;
        const from = (page - 1) * PAGE_Size;
        const to = from + PAGE_Size - 1;

        let query = supabase
            .from("reports")
            .select(`
                *,
                anime:animes(id, title, slug, poster),
                user:profiles(username, avatar_url)
            `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data, error, count } = await query;

        if (error) {
            console.error("Get reports error:", error);
            return { success: false, error: "Bildirimler alınamadı.", data: [], totalPages: 0 };
        }

        // Map data to match ReportWithDetails type if needed, but the select structure matches closely.
        // Warning: user_id join might return user object differently?
        // Supposedly `user:user_id(...)` works if relation exists.
        // Supabase auto-detects relation on FK. `user_id references auth.users`.
        // However, `auth.users` is not directly accessible usually via plain select unless specific view or config.
        // Usually we join `public.profiles` or similar. `auth.users` join is tricky.
        // Let's assume we have `public.profiles` linked to `auth.users` via `id`.
        // Most projects use `profiles` table.
        // Let's check `src/types/supabase/tables/profiles.ts` or similar.
        // Step 848 showed `export type { ProfilesTable } from "./profiles";`.
        // If `profiles` exists and has `id` FK to `auth.users`, we should join `profiles` ON `reports.user_id = profiles.id`.
        // So query should be `user:profiles(...)`.

        // Let's Retry query with profiles.

        return {
            success: true,
            data: data as unknown as ReportWithDetails[],
            totalPages: Math.ceil((count || 0) / PAGE_Size)
        };

    } catch (error) {
        console.error("Get reports error:", error);
        return { success: false, error: "Beklenmeyen bir hata oluştu.", data: [], totalPages: 0 };
    }
}

export async function updateReportStatus(id: string, status: 'pending' | 'resolved' | 'dismissed') {
    try {
        const auth = await requireAdmin();
        if (isAuthError(auth)) return auth;

        const supabase = await createClient();
        const { error } = await supabase
            .from("reports")
            .update({ status, updated_at: new Date().toISOString() } as never)
            .eq("id", id);

        if (error) throw error;

        revalidatePath("/panel/reports");
        return { success: true };
    } catch {
        return { success: false, error: "Durum güncellenemedi." };
    }
}

export async function deleteReport(id: string) {
    try {
        const auth = await requireAdmin();
        if (isAuthError(auth)) return auth;

        const supabase = await createClient();
        const { error } = await supabase.from("reports").delete().eq("id", id);

        if (error) throw error;

        revalidatePath("/panel/reports");
        return { success: true };
    } catch {
        return { success: false, error: "Silme işlemi başarısız." };
    }
}
