"use server";

import { createClient } from "@/lib/supabase/server";
import { logError, getErrorMessage } from "@/lib/errors";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { revalidateEpisodeData } from "@/lib/cache/revalidate";
import { z } from "zod";

type ActionResult<T = void> =
    | { success: true; data?: T }
    | { success: false; error: string };

const episodeIdSchema = z.string().uuid("Geçersiz bölüm UUID");

export async function deleteEpisode(id: string): Promise<ActionResult> {
    // Auth kontrolü
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Doğrulama
    const validation = episodeIdSchema.safeParse(id);
    if (!validation.success) {
        return { success: false, error: "Geçersiz bölüm ID" };
    }

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("episodes")
            .delete()
            .eq("id", id);

        if (error) throw error;

        // Cache temizleme
        revalidateEpisodeData();

        return { success: true };
    } catch (error) {
        logError("deleteEpisode", error);
        return { success: false, error: getErrorMessage(error, "Bölüm silinirken bir hata oluştu.") };
    }
}
