"use server";

import { createPublicClient } from "@/lib/supabase/server";
import { logError } from "@/lib/errors";
import type { SiteSettingRow } from "@/types/supabase/tables";

/**
 * Tüm site ayarlarını getirir (public - herkes okuyabilir)
 */
export async function getAllSettings(): Promise<{
    success: boolean;
    data?: SiteSettingRow[];
    error?: string;
}> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .order("category", { ascending: true });

        if (error) {
            logError("getAllSettings", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        logError("getAllSettings", error);
        return { success: false, error: "Ayarlar yüklenirken hata oluştu." };
    }
}

/**
 * Belirli bir kategorideki ayarları getirir
 */
export async function getSettingsByCategory(
    category: "general" | "seo" | "social" | "content" | "advanced"
): Promise<{ success: boolean; data?: SiteSettingRow[]; error?: string }> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq("category", category)
            .order("id", { ascending: true });

        if (error) {
            logError("getSettingsByCategory", error);
            return { success: false, error: error.message };
        }

        return { success: true, data: data || [] };
    } catch (error) {
        logError("getSettingsByCategory", error);
        return { success: false, error: "Ayarlar yüklenirken hata oluştu." };
    }
}

/**
 * Tek bir ayarı key ile getirir
 */
export async function getSettingByKey(
    key: string
): Promise<{ success: boolean; data?: SiteSettingRow; error?: string }> {
    try {
        const supabase = createPublicClient();

        const { data, error } = await supabase
            .from("site_settings")
            .select("*")
            .eq("key", key)
            .single();

        if (error) {
            logError("getSettingByKey", error);
            return { success: false, error: error.message };
        }

        return { success: true, data };
    } catch (error) {
        logError("getSettingByKey", error);
        return { success: false, error: "Ayar yüklenirken hata oluştu." };
    }
}
