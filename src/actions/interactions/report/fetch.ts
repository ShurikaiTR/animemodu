"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import type { ReportWithDetails } from "@/types/helpers";

const PAGE_SIZE = 20;

export async function getReports(page = 1, status: string | null = null) {
    try {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            return { success: false, error: auth.error, data: [], totalPages: 0 };
        }

        const supabase = await createClient();
        const from = (page - 1) * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;

        let query = supabase
            .from("reports")
            .select(`
                *,
                anime:animes(id, title, slug, poster_path),
                user:profiles(username, avatar_url)
            `, { count: "exact" })
            .order("created_at", { ascending: false })
            .range(from, to);

        if (status && status !== "all") {
            query = query.eq("status", status);
        }

        const { data, error, count } = await query;

        if (error) {
            return { success: false, error: "Bildirimler alınamadı.", data: [], totalPages: 0 };
        }

        return {
            success: true,
            data: data as unknown as ReportWithDetails[],
            totalPages: Math.ceil((count || 0) / PAGE_SIZE)
        };

    } catch {
        return { success: false, error: "Beklenmeyen bir hata oluştu.", data: [], totalPages: 0 };
    }
}
