"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { logError, getErrorMessage } from "@/shared/lib/errors";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { revalidateEpisodeData } from "@/shared/lib/cache/revalidate";
import { episodeIdSchema } from "@/shared/lib/validations/anime";

type ActionResult<T = void> =
    | { success: true; data?: T }
    | { success: false; error: string };

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
