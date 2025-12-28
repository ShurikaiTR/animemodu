import CastSection from "./CastSection";
import type { CastMember } from "./types";
import { parseCharacters, type Character } from "@/shared/types/helpers";
import { getAnimeBySlugOrNotFound } from "@/shared/lib/anime/queries";

interface CastSectionServerProps {
  slug: string;
}

export default async function CastSectionServer({ slug }: CastSectionServerProps) {
  const dbAnime = await getAnimeBySlugOrNotFound(slug);

  const characters = parseCharacters(dbAnime.characters ?? null);
  const displayCast: CastMember[] = characters.map((c: Character) => ({
    id: c.id,
    name: c.name,
    character: c.role === "MAIN" ? "Ana Karakter" : c.role === "SUPPORTING" ? "Yan Karakter" : "Karakter",
    profile_path: c.image,
    role: c.role,
  }));

  return <CastSection cast={displayCast} />;
}


