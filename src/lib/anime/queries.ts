import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import type { AnimesTable } from "@/types/supabase/tables";

type AnimeRow = AnimesTable["Row"];

/**
 * Fetches an anime by slug from the database
 * @param slug - The anime's URL slug
 * @param select - Columns to select (default: all)
 * @returns The anime row or null if not found
 * 
 * Note: Dynamic select string requires explicit type assertion because
 * Supabase cannot infer the return type at compile time
 */
export async function getAnimeBySlug(
  slug: string,
  select: string = "*"
): Promise<AnimeRow | null> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("animes")
    .select(select)
    .eq("slug", slug)
    .single();

  if (error || !data) {
    return null;
  }

  // Dynamic select requires explicit cast - Supabase limitation with string-based column selection
  // Type safety is maintained by the function's return type contract
  return data as unknown as AnimeRow;
}

export async function getAnimeBySlugOrNotFound(
  slug: string,
  select: string = "*"
): Promise<AnimesTable["Row"]> {
  const anime = await getAnimeBySlug(slug, select);
  
  if (!anime) {
    notFound();
  }

  return anime;
}

export function getStructureType(structureType: string | null | undefined): "seasonal" | "absolute" {
  return (structureType === "absolute" ? "absolute" : "seasonal");
}

