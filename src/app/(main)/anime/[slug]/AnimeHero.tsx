import Image from "next/image";
import { Play, Star } from "lucide-react";
import { getImageUrl } from "@/shared/lib/tmdb";
import Container from "@/shared/components/container";
import FavoriteButton from "@/shared/components/FavoriteButton";
import WatchStatusDropdown from "@/shared/components/WatchStatusDropdown";
import type { WatchStatus } from "@/shared/components/WatchStatusDropdown/config";

interface Genre {
  id: number;
  name: string;
}

interface VideoResult {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
}

interface AnimeHeroData {
  id: string;
  title: string;
  overview: string | null;
  poster_path: string | null;
  backdrop_path: string | null;
  vote_average: number | null;
  release_date: string | null;
  genres: Genre[];
  slug: string;
}

interface AnimeHeroProps {
  anime: AnimeHeroData;
  trailer?: VideoResult;
  initialFavorite?: boolean;
  initialWatchStatus?: WatchStatus | null;
}

export default function AnimeHero({ anime, trailer, initialFavorite, initialWatchStatus }: AnimeHeroProps) {
  return (
    <section className="section section--head section--head-fixed section--gradient section--details-bg relative overflow-hidden pb-16 pt-32 -mt-36 bg-bg-main">
      <div className="absolute top-0 left-0 right-0 h-96 w-full z-0">
        <Image
          src={getImageUrl(anime.backdrop_path || anime.poster_path, "w780")}
          alt={`${anime.title} arkaplan görseli`}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 100vw, 100vw"
          className="object-cover opacity-40 select-none"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-bg-main/30 via-bg-main/80 to-bg-main z-10" />
      </div>

      <Container className="z-20 relative">
        <div className="flex flex-col xl:flex-row xl:items-start gap-8">
          <div className="flex-1 min-w-0">
            {trailer && (
              <a
                href={`https://www.youtube.com/watch?v=${trailer.key}`}
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center text-white text-lg hover:text-primary transition-colors mb-6 group w-fit"
              >
                <div className="w-12 h-12 flex items-center justify-center rounded-full border border-white group-hover:border-primary transition-colors mr-4">
                  <Play className="w-5 h-5 fill-current ml-1" />
                </div>
                Fragmanı İzle
              </a>
            )}

            <div className="mb-6 inline-flex items-center gap-4 ml-6 align-top">
              <WatchStatusDropdown animeId={anime.id} initialStatus={initialWatchStatus} variant="hero" />
              <FavoriteButton animeId={anime.id} initialFavorite={initialFavorite} variant="featured" />
            </div>

            <div className="article__content mb-10">
              <h1 className="text-4xl text-white font-rubik font-normal mb-6 leading-tight">
                {anime.title}
              </h1>

              <ul className="flex flex-wrap items-center gap-6 mb-6 text-text-main font-inter text-base">
                <li className="flex items-center gap-1.5 text-white">
                  <Star className="w-5 h-5 fill-primary text-primary" />
                  {anime.vote_average?.toFixed(1)}
                </li>
                {anime.genres.slice(0, 3).map((g, index) => (
                  <li
                    key={`genre-${g.id}-${index}`}
                    className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full"
                  >
                    {g.name}
                  </li>
                ))}
                <li className="relative pl-6 before:content-[''] before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 before:w-1 before:h-1 before:bg-primary before:rounded-full">
                  {anime.release_date ? anime.release_date.split("-")[0] : "N/A"}
                </li>
              </ul>

              <p className="text-text-main text-base leading-relaxed max-w-3xl">
                {anime.overview || "Bu içerik için henüz bir özet bulunmuyor."}
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
