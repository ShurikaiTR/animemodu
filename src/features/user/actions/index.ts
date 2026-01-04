"use server";

import { revalidatePath } from "next/cache";

import { safeAction } from "@/shared/lib/actions/wrapper";
import { isAuthError, requireAdmin } from "@/shared/lib/auth/guards";
import { userIdSchema } from "@/shared/lib/validations/user";

import { UserService } from "../services/user-service";

export async function deleteUser(userId: string) {
    return await safeAction(async () => {
        const auth = await requireAdmin();
        if (isAuthError(auth)) {
            throw new Error(auth.error);
        }

        // Validation
        const validation = userIdSchema.safeParse(userId);
        if (!validation.success) {
            throw new Error("Geçersiz kullanıcı ID");
        }

        const isDeletingSelf = auth.userId === userId;

        await UserService.deleteUser(userId);

        revalidatePath("/panel/users");

        return {
            deletedSelf: isDeletingSelf
        };
    }, "deleteUser");
}

