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
    // SEO - General
    seo_og_image: string;
    // SEO - Home
    seo_home_title: string;
    seo_home_description: string;
    // SEO - Discover
    seo_discover_title: string;
    seo_discover_description: string;
    // SEO - Animes
    seo_animes_title: string;
    seo_animes_description: string;
    // SEO - Movies
    seo_movies_title: string;
    seo_movies_description: string;
    // SEO - Calendar
    seo_calendar_title: string;
    seo_calendar_description: string;
    // SEO - Anime Detail
    seo_anime_title: string;
    seo_anime_description: string;
    // SEO - Watch
    seo_watch_title: string;
    seo_watch_description: string;
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
    // SEO - Defaults
    seo_og_image: "/img/opengraph/opengraph.webp",
    seo_home_title: "AnimeModu · HD Anime İzle",
    seo_home_description: "En yeni animeleri HD kalitesinde izleyin.",
    seo_discover_title: "Keşfet · AnimeModu",
    seo_discover_description: "Yeni animeler keşfedin.",
    seo_animes_title: "Animeler · AnimeModu",
    seo_animes_description: "Tüm animeler listesi.",
    seo_movies_title: "Filmler · AnimeModu",
    seo_movies_description: "Tüm anime filmleri.",
    seo_calendar_title: "Takvim · AnimeModu",
    seo_calendar_description: "Haftalık anime yayın takvimi.",
    seo_anime_title: "{anime_title} İzle",
    seo_anime_description: "{anime_title} konusu ve tüm bölümleri.",
    seo_watch_title: "{anime_title} {episode_number}. Bölüm İzle",
    seo_watch_description: "{anime_title} {episode_number}. bölüm Türkçe altyazılı izle.",
};
