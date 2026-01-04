import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { notFound } from "next/navigation";
import { getImageUrl } from "@/shared/lib/tmdb";
import { createClient } from "@/shared/lib/supabase/server";
import { parseCharacters } from "@/shared/types/helpers";
import { filterAiredEpisodes, mapEpisodeRowsToEpisodes, orderEpisodesBySeasonAndNumber } from "@/shared/lib/anime/episodes";
import { getAnimeBySlug, getStructureType } from "@/shared/lib/anime/queries";
import { getSiteInfo } from "@/features/settings/actions";
import Container from "@/shared/components/container";
import AnimeHero from "./AnimeHero";
import EpisodeList from "./EpisodeList";
import CastList from "./CastList";
import { HeroSkeleton, EpisodesSkeleton, CastSkeleton } from "./loading";

const CommentsSection = dynamic(
  () => import("@/features/anime/components/CommentsSection"),
  { loading: () => <div className="animate-pulse h-64 bg-white/5 rounded-xl" /> }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbAnime = await getAnimeBySlug(slug);
  const siteInfo = await getSiteInfo();

  if (!dbAnime) {
    return { title: "Anime Bulunamadı" };
  }

  const yearLabel = dbAnime.release_date ? new Date(dbAnime.release_date).getFullYear().toString() : "";
  const genresLabel = dbAnime.genres?.join(", ") || "";
  const overviewLabel = dbAnime.overview || "";

  const title = siteInfo.seo_anime_title
    .replace(/{anime_title}/g, dbAnime.title)
    .replace(/{year}/g, yearLabel)
    .replace(/{genres}/g, genresLabel);

  const description = siteInfo.seo_anime_description
    .replace(/{anime_title}/g, dbAnime.title)
    .replace(/{year}/g, yearLabel)
    .replace(/{genres}/g, genresLabel)
    .replace(/{overview}/g, overviewLabel);

  return {
    title,
    description: dbAnime.overview || description,
    openGraph: {
      title,
      description: dbAnime.overview || description,
      images: dbAnime.poster_path ? [getImageUrl(dbAnime.poster_path, "w500")] : undefined,
    },
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  // Single fetch for anime data
  const dbAnime = await getAnimeBySlug(slug);
  if (!dbAnime) notFound();

  const supabase = await createClient();
  const structureType = getStructureType(dbAnime.structure_type);

  // Fetch episodes
  let query = supabase
    .from("episodes")
    .select("*")
    .eq("anime_id", dbAnime.id);

  query = orderEpisodesBySeasonAndNumber(query);
  const { data: episodesData } = await query;

  const airedEpisodes = filterAiredEpisodes(episodesData || []);
  const episodes = mapEpisodeRowsToEpisodes(airedEpisodes);

  // Parse characters
  const characters = parseCharacters(dbAnime.characters ?? null);

  // Find trailer
  const trailer = dbAnime.trailer_key
    ? { id: "1", key: dbAnime.trailer_key, name: "Trailer", site: "YouTube", type: "Trailer" }
    : undefined;

  // Parse genres
  const genres = dbAnime.genres
    ? dbAnime.genres.map((g: string) => ({ id: 0, name: g }))
    : [];

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <AnimeHero
          anime={{
            id: dbAnime.id,
            title: dbAnime.title,
            overview: dbAnime.overview,
            poster_path: dbAnime.poster_path,
            backdrop_path: dbAnime.backdrop_path,
            vote_average: dbAnime.vote_average,
            release_date: dbAnime.release_date,
            genres,
            slug: dbAnime.slug,
          }}
          trailer={trailer}
        />
      </Suspense>

      <section className="relative overflow-hidden pb-16 pt-8 bg-bg-main">
        <Container>
          <div className="flex flex-col xl:flex-row xl:items-start gap-8">
            <div className="flex-1 min-w-0 space-y-8">
              <Suspense fallback={<EpisodesSkeleton />}>
                <EpisodeList
                  episodes={episodes}
                  structureType={structureType}
                  animeSlug={dbAnime.slug}
                  animeBackdrop={dbAnime.backdrop_path}
                />
              </Suspense>

              <Suspense fallback={<CastSkeleton />}>
                <CastList characters={characters} />
              </Suspense>

              <CommentsSection animeId={dbAnime.id} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
