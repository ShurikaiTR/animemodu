"use server";

import { createClient } from "@/lib/supabase/server";
import { revalidatePath } from "next/cache";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { reportIdSchema, reportStatusSchema, formatZodError } from "@/lib/validations/anime";

type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export async function updateReportStatus(id: number, status: ReportStatus) {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const idValidation = reportIdSchema.safeParse(id);
    if (!idValidation.success) {
        return { success: false, error: formatZodError(idValidation.error) };
    }

    const statusValidation = reportStatusSchema.safeParse(status);
    if (!statusValidation.success) {
        return { success: false, error: formatZodError(statusValidation.error) };
    }

    const supabase = await createClient();
    const { error } = await supabase
        .from("reports")
        .update({ status, updated_at: new Date().toISOString() } as never)
        .eq("id", id);

    if (error) {
        return { success: false, error: "Durum güncellenemedi." };
    }

    revalidatePath("/panel/reports");
    return { success: true };
}

export async function deleteReport(id: number) {
    const auth = await requireAdmin();
    if (isAuthError(auth)) return auth;

    // Validation
    const validation = reportIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const supabase = await createClient();
    const { error } = await supabase.from("reports").delete().eq("id", id);

    if (error) {
        return { success: false, error: "Silme işlemi başarısız." };
    }

    revalidatePath("/panel/reports");
    return { success: true };
}
