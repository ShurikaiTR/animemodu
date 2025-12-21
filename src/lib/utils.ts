import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getAvatarUrl(avatarUrl?: string | null): string {
  if (avatarUrl && avatarUrl.trim() !== "") {
    return avatarUrl;
  }
  return "/default-avatar.png";
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
