"use server";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";

import { ReportService } from "../services/report-service";

const PAGE_SIZE = 20;

export async function getReports(page = 1, status: string | null = null) {
    return await safeAction(async () => {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        const { items, count } = await ReportService.getAll({
            page,
            pageSize: PAGE_SIZE,
            status
        });

        return {
            items,
            totalPages: Math.ceil(count / PAGE_SIZE)
        };
    }, "getReports");
}
