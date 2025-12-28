"use server";

import { createClient } from "@/shared/lib/supabase/server";
import { createAdminClient } from "@/shared/lib/supabase/admin";
import { revalidatePath } from "next/cache";
import { logError, getErrorMessage } from "@/shared/lib/errors";
import { requireAdmin, isAuthError } from "@/shared/lib/auth/guards";
import { userIdSchema } from "@/shared/lib/validations/user";

type DeleteUserResult = { success: true; deletedSelf: boolean } | { success: false; error: string };

export async function deleteUser(userId: string): Promise<DeleteUserResult> {
    // Auth check
    const auth = await requireAdmin();
    if (isAuthError(auth)) {
        return { success: false, error: auth.error };
    }

    // Validation
    const validation = userIdSchema.safeParse(userId);
    if (!validation.success) {
        return { success: false, error: "Geçersiz kullanıcı ID" };
    }

    const isDeletingSelf = auth.userId === userId;

    try {
        const adminClient = createAdminClient();
        const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

        if (authError) {
            return { success: false, error: `Auth silme hatası: ${authError.message}` };
        }

        const supabase = await createClient();
        const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", userId);

        if (profileError) {
            // Auth already deleted, profile deletion is secondary
            logError("deleteUser.deleteProfile", profileError);
        }

        revalidatePath("/panel/users");

        return {
            success: true,
            deletedSelf: isDeletingSelf
        };
    } catch (error) {
        logError("deleteUser", error);
        return { success: false, error: `Kullanıcı silinirken hata: ${getErrorMessage(error)}` };
    }
}

