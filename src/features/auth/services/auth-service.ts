import { createClient } from "@/shared/lib/supabase/server";

import { ForgotPasswordInput, LoginInput, RegisterInput } from "../schemas/auth-schemas";

export type AuthResult =
    | { success: true; error?: never }
    | { success: false; error: string };

export const AuthService = {
    async login(data: LoginInput): Promise<AuthResult> {
        const supabase = await createClient();
        const { error } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    async register(data: RegisterInput, redirectTo: string): Promise<AuthResult> {
        const supabase = await createClient();
        const { error } = await supabase.auth.signUp({
            email: data.email,
            password: data.password,
            options: {
                data: { full_name: data.username, username: data.username },
                emailRedirectTo: redirectTo,
            },
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    },

    async resetPassword(data: ForgotPasswordInput, redirectTo: string): Promise<AuthResult> {
        const supabase = await createClient();
        const { error } = await supabase.auth.resetPasswordForEmail(data.email, {
            redirectTo: redirectTo,
        });

        if (error) return { success: false, error: error.message };
        return { success: true };
    }
};
