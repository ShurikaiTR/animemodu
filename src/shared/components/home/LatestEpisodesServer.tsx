import { createPublicClient } from "@/shared/lib/supabase/server";
import LatestEpisodes from "./LatestEpisodes";

/** Episode item structure expected by LatestEpisodes component */
interface EpisodeItem {
  id: string;
  episode_number: number;
  season_number: number;
  absolute_episode_number: number | null;
  still_path: string | null;
  created_at: string;
  anime: {
    title: string;
    slug: string;
    poster_path: string | null;
    structure_type: "seasonal" | "absolute";
  };
}

/** Raw episode data from Supabase with relation alias */
interface EpisodeWithAnime {
  id: string;
  episode_number: number;
  season_number: number;
  absolute_episode_number: number | null;
  still_path: string | null;
  created_at: string;
  anime: {
    title: string;
    slug: string;
    poster_path: string | null;
    structure_type: "seasonal" | "absolute" | null;
  } | null;
}

export default async function LatestEpisodesServer() {
  const supabase = createPublicClient();

  const { data: latestEpisodes } = await supabase
    .from("episodes")
    .select("id, episode_number, season_number, absolute_episode_number, still_path, created_at, anime:animes(title, slug, poster_path, structure_type)")
    .order("created_at", { ascending: false })
    .order("season_number", { ascending: false })
    .order("episode_number", { ascending: false })
    .limit(12);

  // Transform and filter episodes with valid anime data
  const episodes: EpisodeItem[] = (latestEpisodes as EpisodeWithAnime[] || [])
    .filter((ep): ep is EpisodeWithAnime & { anime: NonNullable<EpisodeWithAnime["anime"]> } => ep.anime !== null)
    .map((ep) => ({
      id: ep.id,
      episode_number: ep.episode_number,
      season_number: ep.season_number,
      absolute_episode_number: ep.absolute_episode_number,
      still_path: ep.still_path,
      created_at: ep.created_at,
      anime: {
        title: ep.anime.title,
        slug: ep.anime.slug,
        poster_path: ep.anime.poster_path,
        structure_type: ep.anime.structure_type ?? "seasonal",
      },
    }));

  return <LatestEpisodes episodes={episodes} />;
}
