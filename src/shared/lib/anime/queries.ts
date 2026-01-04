import { notFound } from "next/navigation";

import { createClient } from "@/shared/lib/supabase/server";
import type { AnimeRow } from "@/shared/types/helpers";



/**
 * Fetches all anime columns by slug from the database
 * @param slug - The anime's URL slug
 * @returns The full anime row or null if not found
 */
export async function getAnimeBySlug(
  slug: string
): Promise<AnimeRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select()
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  return data;
}

/**
 * Fetches anime by slug or triggers notFound
 * @param slug - The anime's URL slug
 * @returns The anime row
 */
export async function getAnimeBySlugOrNotFound(
  slug: string
): Promise<AnimeRow> {
  const anime = await getAnimeBySlug(slug);

  if (!anime) {
    notFound();
  }

  return anime;
}

export function getStructureType(structureType: string | null | undefined): "seasonal" | "absolute" {
  return (structureType === "absolute" ? "absolute" : "seasonal");
}
