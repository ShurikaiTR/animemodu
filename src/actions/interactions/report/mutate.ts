"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";

type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export async function updateReportStatus(id: string, status: ReportStatus) {
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
