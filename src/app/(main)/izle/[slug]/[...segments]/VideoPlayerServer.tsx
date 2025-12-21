import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WatchClient from "./client";
import type { Episode } from "@/app/(main)/anime/[slug]/types";
import { getAnimeBySlugOrNotFound, getStructureType } from "@/lib/anime/queries";
import { mapEpisodeRowsToEpisodes, orderEpisodesBySeasonAndNumber } from "@/lib/anime/episodes";

interface VideoPlayerServerProps {
  slug: string;
  segments: string[];
}

export default async function VideoPlayerServer({ slug, segments }: VideoPlayerServerProps) {
  const supabase = await createClient();

  const anime = await getAnimeBySlugOrNotFound(slug, "*");

  const structureType = getStructureType(anime.structure_type);
  let episodeNumber: number | null = null;
  let seasonNumber: number | null = null;

  if (structureType === "seasonal") {
    if (segments.length !== 2) {
      notFound();
    }

    const seasonMatch = segments[0]?.match(/^sezon-(\d+)$/i);
    const episodeMatch = segments[1]?.match(/^bolum-(\d+)$/i);

    if (!seasonMatch || !episodeMatch) {
      notFound();
    }

    seasonNumber = parseInt(seasonMatch[1]);
    episodeNumber = parseInt(episodeMatch[1]);
  } else {
    if (segments.length !== 1) {
      notFound();
    }

    const episodeMatch = segments[0]?.match(/^bolum-(\d+)$/i);

    if (!episodeMatch) {
      notFound();
    }

    episodeNumber = parseInt(episodeMatch[1]);
  }

  if (episodeNumber === null || isNaN(episodeNumber)) {
    notFound();
  }

  let query = supabase
    .from("episodes")
    .select("*")
    .eq("anime_id", anime.id);

  if (structureType === "seasonal") {
    if (seasonNumber === null) {
      notFound();
    }
    query = query.eq("season_number", seasonNumber).eq("episode_number", episodeNumber);
  } else {
    query = query.eq("episode_number", episodeNumber).order("absolute_episode_number", { ascending: true });
  }

  const { data: episodeData, error: episodeError } = await query.single();

  if (episodeError || !episodeData) {
    notFound();
  }

  const currentEpisode: Episode = mapEpisodeRowsToEpisodes([episodeData])[0];

  let allEpisodesQuery = supabase
    .from("episodes")
    .select("*")
    .eq("anime_id", anime.id);

  allEpisodesQuery = orderEpisodesBySeasonAndNumber(allEpisodesQuery);

  const { data: allEpisodes, error: episodesError } = await allEpisodesQuery;

  if (episodesError) {
    notFound();
  }

  const episodes: Episode[] = mapEpisodeRowsToEpisodes(allEpisodes || []);

  return (
    <WatchClient
      episode={currentEpisode}
      anime={{
        id: anime.id,
        title: anime.title,
        slug: anime.slug,
        backdrop_path: anime.backdrop_path,
        poster_path: anime.poster_path,
        structure_type: anime.structure_type || "seasonal",
      }}
      episodes={episodes}
    />
  );
}

