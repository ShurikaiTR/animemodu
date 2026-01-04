"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { createClient } from "@/shared/lib/supabase/server";
import { formatZodError, reportIdSchema, reportStatusSchema } from "@/shared/lib/validations/anime";

type ReportStatus = 'pending' | 'resolved' | 'dismissed';

export async function updateReportStatus(id: string, status: ReportStatus) {
    return await safeAction(async () => {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        // Validation
        const idValidation = reportIdSchema.safeParse(id);
        if (!idValidation.success) {
            throw new Error(formatZodError(idValidation.error));
        }

        const statusValidation = reportStatusSchema.safeParse(status);
        if (!statusValidation.success) {
            throw new Error(formatZodError(statusValidation.error));
        }

        const supabase = await createClient();
        const { error } = await supabase
            .from("reports")
            .update({ status, updated_at: new Date().toISOString() })
            .eq("id", id);

        if (error) {
            throw new Error("Durum güncellenemedi.");
        }

        revalidatePath("/panel/reports");
    }, "updateReportStatus");
}

export async function deleteReport(id: string) {
    return await safeAction(async () => {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        // Validation
        const validation = reportIdSchema.safeParse(id);
        if (!validation.success) {
            throw new Error(formatZodError(validation.error));
        }

        const supabase = await createClient();
        const { error } = await supabase.from("reports").delete().eq("id", id);

        if (error) {
            throw new Error("Silme işlemi başarısız.");
        }

        revalidatePath("/panel/reports");
    }, "deleteReport");
}
