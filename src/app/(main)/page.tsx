import type { Metadata } from "next";
import { Suspense } from "react";

import { SettingsService } from "@/features/settings/services/settings-service";
import FeaturedHero from "@/shared/components/home/FeaturedHero";
import LatestEpisodesServer from "@/shared/components/home/LatestEpisodesServer";
import { AnimesSkeleton, EpisodesSkeleton, HeroSkeleton, MoviesSkeleton } from "@/shared/components/home/loading";
import PopularMovies from "@/shared/components/home/PopularMovies";
import RecentAnimes from "@/shared/components/home/RecentAnimes";

export async function generateMetadata(): Promise<Metadata> {
  const siteInfo = await SettingsService.getAllSettings();

  return {
    title: siteInfo.seo_home_title,
    description: siteInfo.seo_home_description,
    openGraph: {
      title: siteInfo.seo_home_title,
      description: siteInfo.seo_home_description,
    }
  };
}

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
