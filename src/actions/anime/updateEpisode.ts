"use server";

import { createClient } from "@/lib/supabase/server";
import { isErrorWithMessage } from "@/types/helpers";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { updateEpisodeSchema, parseFormData, formatZodError } from "@/lib/validations/anime";
import { revalidateEpisodeData } from "@/lib/cache/revalidate";

type UpdateEpisodeResult = { success: true } | { success: false; error: string };

export async function updateEpisode(formData: FormData): Promise<UpdateEpisodeResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = parseFormData(formData, updateEpisodeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { id, ...rest } = validation.data;

    // Build update data - only include non-null values
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
        if (value !== undefined) {
            data[key] = value;
        }
    }

    const supabase = await createClient();

    try {
        const { error } = await supabase
            .from("episodes")
            .update(data as never)
            .eq("id", id);

        if (error) {
            return { success: false, error: error.message };
        }

        // Revalidate episode cache
        revalidateEpisodeData();

        return { success: true };
    } catch (error) {
        const message = isErrorWithMessage(error) ? error.message : "Bilinmeyen hata";
        return { success: false, error: message };
    }
}
