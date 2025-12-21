import type { Metadata } from "next";
import { Suspense } from "react";
import { cacheLife } from "next/cache";
import FeaturedHero from "@/components/home/FeaturedHero";
import LatestEpisodesServer from "@/components/home/LatestEpisodesServer";
import RecentAnimes from "@/components/home/RecentAnimes";
import PopularMovies from "@/components/home/PopularMovies";
import { HeroSkeleton, EpisodesSkeleton, AnimesSkeleton, MoviesSkeleton } from "@/components/home/loading";

export const metadata: Metadata = {
  title: "AnimeModu - HD Anime İzle",
  description: "En yeni animeleri HD kalitesinde izleyin. AnimeModu, Türkiye'nin en büyük anime platformu.",
};

export default async function Home() {
  "use cache";
  cacheLife("minutes");

  return (
    <>
      <Suspense fallback={<HeroSkeleton />}>
        <FeaturedHero />
      </Suspense>

      <Suspense fallback={<EpisodesSkeleton />}>
        <LatestEpisodesServer />
      </Suspense>

      <Suspense fallback={<AnimesSkeleton />}>
        <RecentAnimes />
      </Suspense>

      <Suspense fallback={<MoviesSkeleton />}>
        <PopularMovies />
      </Suspense>
    </>
  );
}
