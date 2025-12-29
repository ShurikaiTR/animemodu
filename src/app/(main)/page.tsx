import type { Metadata } from "next";
import { Suspense } from "react";
import FeaturedHero from "@/shared/components/home/FeaturedHero";
import LatestEpisodesServer from "@/shared/components/home/LatestEpisodesServer";
import RecentAnimes from "@/shared/components/home/RecentAnimes";
import PopularMovies from "@/shared/components/home/PopularMovies";
import { HeroSkeleton, EpisodesSkeleton, AnimesSkeleton, MoviesSkeleton } from "@/shared/components/home/loading";

export const metadata: Metadata = {
  title: "AnimeModu - HD Anime İzle",
  description: "En yeni animeleri HD kalitesinde izleyin. AnimeModu, Türkiye'nin en büyük anime platformu.",
};

export default async function Home() {
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
