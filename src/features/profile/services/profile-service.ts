import { createClient } from "@/shared/lib/supabase/server";
import type { ProfileRow, ProfileUpdate } from "@/shared/types/helpers";

/**
 * Profile Service - Profil yönetimi işlemleri için servis sınıfı
 * Favoriler, Takip ve İzleme Listesi işlemleri için kendi özel servislerini kullanın.
 */
export const ProfileService = {
    async getProfileById(userId: string): Promise<ProfileRow | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("id", userId)
            .maybeSingle();

        if (error) throw error;
        return data;
    },

    async upsertProfile(userId: string, data: ProfileUpdate): Promise<ProfileRow> {
        const supabase = await createClient();
        const { data: result, error } = await supabase
            .from("profiles")
            .upsert({ id: userId, ...data, updated_at: new Date().toISOString() })
            .select()
            .single();

        if (error) throw error;
        return result;
    },

    async getProfileByUsername(username: string): Promise<ProfileRow | null> {
        const supabase = await createClient();
        const { data, error } = await supabase
            .from("profiles")
            .select("*")
            .eq("username", username)
            .maybeSingle();

        if (error) throw error;
        return data;
    }
};
