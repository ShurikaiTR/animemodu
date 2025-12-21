export type SettingType = "text" | "textarea" | "image" | "boolean" | "number" | "json";
export type SettingCategory = "general" | "seo" | "social" | "content" | "advanced";

export interface SiteSettingsTable {
    Row: {
        id: number;
        key: string;
        value: string | null;
        type: SettingType;
        category: SettingCategory;
        label: string | null;
        description: string | null;
        created_at: string;
        updated_at: string;
    };
    Insert: {
        id?: number;
        key: string;
        value?: string | null;
        type?: SettingType;
        category?: SettingCategory;
        label?: string | null;
        description?: string | null;
        created_at?: string;
        updated_at?: string;
    };
    Update: {
        id?: number;
        key?: string;
        value?: string | null;
        type?: SettingType;
        category?: SettingCategory;
        label?: string | null;
        description?: string | null;
        created_at?: string;
        updated_at?: string;
    };
    Relationships: [];
}

// Convenience type aliases
export type SiteSettingRow = SiteSettingsTable["Row"];
export type SiteSettingInsert = SiteSettingsTable["Insert"];
export type SiteSettingUpdate = SiteSettingsTable["Update"];

// Site bilgileri için typed interface
export interface SiteInfo {
    site_name: string;
    site_footer_text: string;
    site_logo: string;
    site_favicon: string;
    // Feature toggles
    maintenance_mode: boolean;
    watch_together: boolean;
    // Social media
    social_x: string;
    social_instagram: string;
    social_telegram: string;
    social_discord: string;
    social_reddit: string;
}

// Default değerler
export const DEFAULT_SITE_INFO: SiteInfo = {
    site_name: "AnimeModu",
    site_footer_text: "Movies & TV Shows, Online cinema, Movie database. Türkçe altyazılı anime arşivi.",
    site_logo: "/img/animemodu-logo.svg",
    site_favicon: "/favicon.ico",
    maintenance_mode: false,
    watch_together: false,
    social_x: "",
    social_instagram: "",
    social_telegram: "",
    social_discord: "",
    social_reddit: "",
};


