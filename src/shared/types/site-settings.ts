/**
 * Site settings types and defaults
 */

export interface SiteInfo {
    site_name: string;
    site_footer_text: string;
    site_logo: string;
    site_favicon: string;
    maintenance_mode: boolean;
    watch_together: boolean;
    social_x: string;
    social_instagram: string;
    social_telegram: string;
    social_discord: string;
    social_reddit: string;
}

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
