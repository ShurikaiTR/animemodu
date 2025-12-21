import CastSection from "./CastSection";
import type { CastMember } from "./types";
import { parseCharacters, type Character } from "@/types/helpers";
import { getAnimeBySlugOrNotFound } from "@/lib/anime/queries";

interface CastSectionServerProps {
  slug: string;
}

export default async function CastSectionServer({ slug }: CastSectionServerProps) {
  const dbAnime = await getAnimeBySlugOrNotFound(slug, "characters");

  const characters = parseCharacters(dbAnime.characters ?? null);
  const displayCast: CastMember[] = characters.slice(0, 10).map((c: Character) => ({
    id: c.id,
    name: c.name.full,
    character: c.role === "MAIN" ? "Ana Karakter" : c.role === "SUPPORTING" ? "Yan Karakter" : "Karakter",
    profile_path: c.image.large,
    role: c.role,
  }));

  return <CastSection cast={displayCast} />;
}


