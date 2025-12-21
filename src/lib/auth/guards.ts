import { createClient } from "@/lib/supabase/server";

export type AuthResult = {
    userId: string;
    role: "admin" | "user";
};

export type AuthError = {
    success: false;
    error: string;
};

/**
 * Requires user to be authenticated
 * Returns user info or error object for Server Actions
 */
export async function requireUser(): Promise<AuthResult | AuthError> {
    const supabase = await createClient();

    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
        return { success: false, error: "Yetkisiz işlem: Oturum açmanız gerekiyor." };
    }

    const { data: profile } = await supabase
        .from("profiles")
        .select("role")
        .eq("id", user.id)
        .single();

    return {
        userId: user.id,
        role: (profile as { role: string } | null)?.role === "admin" ? "admin" : "user",
    };
}

/**
 * Requires user to be authenticated AND have admin role
 * Returns user info or error object for Server Actions
 */
export async function requireAdmin(): Promise<AuthResult | AuthError> {
    const result = await requireUser();

    if (isAuthError(result)) {
        return result;
    }

    if (result.role !== "admin") {
        return { success: false, error: "Yetkisiz işlem: Bu işlemi sadece yöneticiler yapabilir." };
    }

    return result;
}

/**
 * Type guard to check if result is an auth error
 */
export function isAuthError(result: AuthResult | AuthError): result is AuthError {
    return "success" in result && result.success === false;
}

/**
 * Requires user to be the owner of a resource OR admin
 * Useful for profile updates, comment edits, etc.
 */
export async function requireOwnerOrAdmin(resourceOwnerId: string): Promise<AuthResult | AuthError> {
    const result = await requireUser();

    if (isAuthError(result)) {
        return result;
    }

    // Admin can access anything
    if (result.role === "admin") {
        return result;
    }

    // Check ownership
    if (result.userId !== resourceOwnerId) {
        return { success: false, error: "Yetkisiz işlem: Bu kaynağa erişim yetkiniz yok." };
    }

    return result;
}

