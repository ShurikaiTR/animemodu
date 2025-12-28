import { createClient } from "@/shared/lib/supabase/server";
import { notFound } from "next/navigation";
import type { Episode, AnimeDetailData } from "./types";
import EpisodeListClient from "./EpisodeListClient";
import { getAnimeBySlugOrNotFound } from "@/shared/lib/anime/queries";
import { filterAiredEpisodes, mapEpisodeRowsToEpisodes, orderEpisodesBySeasonAndNumber } from "@/shared/lib/anime/episodes";

interface EpisodesListServerProps {
  slug: string;
  animeId: string;
  structureType: "seasonal" | "absolute";
}

export default async function EpisodesListServer({
  slug,
  animeId,
  structureType,
}: EpisodesListServerProps) {
  const supabase = await createClient();

  const dbAnime = await getAnimeBySlugOrNotFound(slug);

  let query = supabase
    .from("episodes")
    .select("*")
    .eq("anime_id", animeId);

  query = orderEpisodesBySeasonAndNumber(query);

  const { data: episodesData } = await query;

  if (!episodesData) {
    notFound();
  }

  const airedEpisodes = filterAiredEpisodes(episodesData);
  const episodes: Episode[] = mapEpisodeRowsToEpisodes(airedEpisodes);

  const animeData: AnimeDetailData = {
    id: dbAnime.id,
    title: dbAnime.title,
    slug: dbAnime.slug,
  } as AnimeDetailData;

  return (
    <EpisodeListClient
      episodes={episodes}
      structureType={structureType}
      anime={animeData}
    />
  );
}
