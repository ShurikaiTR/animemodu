"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { formatZodError, reportIdSchema, reportStatusSchema } from "@/shared/lib/validations/anime";

import { ReportService } from "../services/report-service";

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

        await ReportService.updateStatus(id, status);

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

        await ReportService.delete(id);

        revalidatePath("/panel/reports");
    }, "deleteReport");
}
