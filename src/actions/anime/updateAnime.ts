"use server";

import { createClient } from "@/lib/supabase/server";
import { requireAdmin, isAuthError } from "@/lib/auth/guards";
import { updateAnimeSchema, parseFormData, formatZodError } from "@/lib/validations/anime";
import { revalidateAnimeData, revalidateFeaturedAnime } from "@/lib/cache/revalidate";

type UpdateAnimeResult = { success: true } | { success: false; error: string };

export async function updateAnime(formData: FormData): Promise<UpdateAnimeResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return auth;
    }

    // Validation
    const validation = parseFormData(formData, updateAnimeSchema);
    if (!validation.success) {
        return { success: false, error: formatZodError(validation.error) };
    }

    const { id, is_featured, ...rest } = validation.data;

    // Build update data - only include non-null values
    const data: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(rest)) {
        if (value !== null && value !== undefined) {
            data[key] = value;
        }
    }
    if (is_featured !== undefined) {
        data.is_featured = is_featured;
    }

    const supabase = await createClient();

    const { error } = await supabase
        .from("animes")
        .update(data as never)
        .eq("id", id);

    if (error) {
        return { success: false, error: error.message };
    }

    // Revalidate cache
    if (data.is_featured !== undefined) {
        revalidateFeaturedAnime();
    }
    revalidateAnimeData(data.slug as string | undefined);

    return { success: true };
}
