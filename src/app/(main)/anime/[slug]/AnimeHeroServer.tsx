import { getAnimeBySlugOrNotFound } from "@/lib/anime/queries";
import { parseCharacters } from "@/types/helpers";
import AnimeHero from "./AnimeHero";
import type { AnimeDetailData, VideoResult } from "./types";

interface AnimeHeroServerProps {
  slug: string;
}

export default async function AnimeHeroServer({ slug }: AnimeHeroServerProps) {
  const dbAnime = await getAnimeBySlugOrNotFound(slug, "*");

  const characters = parseCharacters(dbAnime.characters ?? null);

  const animeData: AnimeDetailData = {
    id: dbAnime.id,
    name: dbAnime.title,
    title: dbAnime.title,
    overview: dbAnime.overview,
    poster_path: dbAnime.poster_path,
    backdrop_path: dbAnime.backdrop_path,
    vote_average: dbAnime.vote_average,
    first_air_date: dbAnime.release_date,
    release_date: dbAnime.release_date,
    status: "Released",
    genres: dbAnime.genres
      ? dbAnime.genres.map((g: string) => ({ id: 0, name: g }))
      : [],
    production_companies: [],
    credits: { cast: [] },
    similar: { results: [] },
    videos: {
      results: dbAnime.trailer_key
        ? [{ id: "1", key: dbAnime.trailer_key, name: "Trailer", site: "YouTube", type: "Trailer" }]
        : [],
    },
    number_of_episodes: 0,
    number_of_seasons: 0,
    characters: characters.map(c => ({
      id: c.id,
      name: { full: c.name.full },
      image: { large: c.image.large },
    })),
    slug: dbAnime.slug,
  };

  const trailer: VideoResult | undefined = animeData.videos.results.find(
    v => v.type === "Trailer" && v.site === "YouTube"
  );

  return <AnimeHero anime={animeData} trailer={trailer} />;
}

