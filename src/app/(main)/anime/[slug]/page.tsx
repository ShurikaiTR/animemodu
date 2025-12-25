import type { Metadata } from "next";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { getImageUrl } from "@/lib/tmdb";
import AnimeHeroServer from "./AnimeHeroServer";
import EpisodesListServer from "./EpisodesListServer";
import CastSectionServer from "./CastSectionServer";
import Container from "@/components/ui/container";
import { HeroSkeleton, EpisodesSkeleton, CastSkeleton } from "./loading";
import { getAnimeBySlug, getAnimeBySlugOrNotFound, getStructureType } from "@/lib/anime/queries";

const CommentsSection = dynamic(
  () => import("@/components/anime/CommentsSection"),
  { loading: () => <div className="animate-pulse h-64 bg-white/5 rounded-xl" /> }
);

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const dbAnime = await getAnimeBySlug(slug, "title, overview, poster_path");

  if (!dbAnime) {
    return {
      title: "Anime Bulunamadı",
    };
  }

  return {
    title: `${dbAnime.title} - AnimeModu`,
    description: dbAnime.overview || `${dbAnime.title} hakkında bilgiler.`,
    openGraph: {
      title: dbAnime.title,
      description: dbAnime.overview || undefined,
      images: dbAnime.poster_path ? [getImageUrl(dbAnime.poster_path, "w500")] : undefined,
    },
  };
}

export default async function AnimeDetailPage({ params }: PageProps) {
  const { slug } = await params;

  const dbAnime = await getAnimeBySlugOrNotFound(slug, "id, structure_type");

  const structureType = getStructureType(dbAnime.structure_type);

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <AnimeHeroServer slug={slug} />
      </Suspense>

      <section className="relative overflow-hidden pb-16 pt-8 bg-bg-main">
        <Container>
          <div className="flex flex-col xl:flex-row xl:items-start gap-8">
            <div className="flex-1 min-w-0 space-y-8">
              <Suspense fallback={<EpisodesSkeleton />}>
                <EpisodesListServer
                  slug={slug}
                  animeId={dbAnime.id}
                  structureType={structureType}
                />
              </Suspense>

              <Suspense fallback={<CastSkeleton />}>
                <CastSectionServer slug={slug} />
              </Suspense>

              <CommentsSection animeId={dbAnime.id} />
            </div>
          </div>
        </Container>
      </section>
    </>
  );
}
