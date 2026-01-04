import { createAdminClient } from "@/shared/lib/supabase/admin";
import { createClient } from "@/shared/lib/supabase/server";

export class UserService {
    /**
     * Delete a user (from both Auth and Profiles)
     * Requires Admin Client for Auth deletion
     */
    static async deleteUser(userId: string): Promise<void> {
        // 1. Delete from Auth (uses Admin Client)
        const adminClient = createAdminClient();
        const { error: authError } = await adminClient.auth.admin.deleteUser(userId);

        if (authError) {
            throw new Error(`Auth silme hatası: ${authError.message}`);
        }

        // 2. Delete from Profiles (uses server client)
        const supabase = await createClient();
        const { error: profileError } = await supabase
            .from("profiles")
            .delete()
            .eq("id", userId);

        if (profileError) {
            // Log error but don't necessarily throw since Auth is already gone
            console.error("[UserService.deleteUser] Profile deletion error:", profileError);
        }
    }
}
