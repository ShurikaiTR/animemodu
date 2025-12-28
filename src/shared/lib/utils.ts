import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(avatarUrl?: string | null): string {
  if (avatarUrl && avatarUrl.trim() !== "") {
    return avatarUrl;
  }
  return "/default-avatar.webp";
}

export function getWatchUrl(
  animeSlug: string,
  episodeNumber: number,
  seasonNumber: number,
  structureType: "seasonal" | "absolute"
): string {
  if (structureType === "seasonal") {
    return `/izle/${animeSlug}/sezon-${seasonNumber}/bolum-${episodeNumber}`;
  } else {
    return `/izle/${animeSlug}/bolum-${episodeNumber}`;
  }
}

/**
 * Converts Turkish text to URL-safe slug
 * Handles Turkish special characters: ç, ğ, ı, ö, ş, ü
 */
export function slugifyTurkish(text: string): string {
  return text
    .toLowerCase()
    .replace(/ /g, "-")
    .replace(/ç/g, "c")
    .replace(/ğ/g, "g")
    .replace(/ı/g, "i")
    .replace(/ö/g, "o")
    .replace(/ş/g, "s")
    .replace(/ü/g, "u");
}

