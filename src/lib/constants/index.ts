/**
 * Application-wide constants
 * Centralizes magic strings and configuration values
 */

// Media Types
export const MEDIA_TYPES = {
    TV: "tv",
    MOVIE: "movie",
} as const;

export type MediaType = typeof MEDIA_TYPES[keyof typeof MEDIA_TYPES];

// Structure Types for anime series
export const STRUCTURE_TYPES = {
    SEASONAL: "seasonal",
    ABSOLUTE: "absolute",
} as const;

export type StructureType = typeof STRUCTURE_TYPES[keyof typeof STRUCTURE_TYPES];

// User Roles
export const USER_ROLES = {
    ADMIN: "admin",
    USER: "user",
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// Character Roles (from AniList)
export const CHARACTER_ROLES = {
    MAIN: "MAIN",
    SUPPORTING: "SUPPORTING",
    BACKGROUND: "BACKGROUND",
} as const;

export type CharacterRole = typeof CHARACTER_ROLES[keyof typeof CHARACTER_ROLES];

// Cache Tags
export const CACHE_TAGS = {
    ANIMES: "animes",
    FEATURED_ANIME: "featured-anime",
    EPISODES: "episodes",
    LATEST_EPISODES: "latest-episodes",
    MOVIES: "movies",
    TV_SERIES: "tv-series",
    SITE_SETTINGS: "site-settings",
} as const;

// Cache Durations (in seconds)
export const CACHE_DURATIONS = {
    MINUTES_1: 60,
    MINUTES_5: 300,
    MINUTES_15: 900,
    HOURS_1: 3600,
    HOURS_24: 86400,
} as const;

// External API URLs
export const API_URLS = {
    TMDB_IMAGE_BASE: "https://image.tmdb.org/t/p",
    TMDB_API_BASE: "https://api.themoviedb.org/3",
    ANILIST_GRAPHQL: "https://graphql.anilist.co",
    YOUTUBE_EMBED: "https://www.youtube.com/embed",
} as const;

// Image Sizes for TMDB
export const TMDB_IMAGE_SIZES = {
    POSTER: {
        SMALL: "w200",
        MEDIUM: "w300",
        LARGE: "w500",
        XLARGE: "w780",
        ORIGINAL: "original",
    },
    BACKDROP: {
        SMALL: "w300",
        MEDIUM: "w780",
        LARGE: "w1280",
        ORIGINAL: "original",
    },
    PROFILE: {
        SMALL: "w45",
        MEDIUM: "w185",
        LARGE: "h632",
        ORIGINAL: "original",
    },
} as const;

// Pagination defaults
export const PAGINATION = {
    DEFAULT_PAGE_SIZE: 20,
    MAX_PAGE_SIZE: 100,
    INITIAL_PAGE: 1,
} as const;

// UI Constants
export const UI = {
    TRUNCATE_DESCRIPTION_LENGTH: 150,
    MAX_CHARACTERS_DISPLAY: 8,
    DEFAULT_AVATAR: "/default-avatar.webp",
    PLACEHOLDER_IMAGE: "/img/placeholder.jpg",
} as const;

