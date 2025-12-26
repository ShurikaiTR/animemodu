import Image from "next/image";
import { Play } from "lucide-react";
import { getImageUrl } from "@/lib/tmdb";
import Container from "@/components/ui/container";
import WatchStatusWrapper from "./WatchStatusWrapper";
import FavoriteButton from "@/components/ui/FavoriteButton";
import type { WatchStatus } from "@/components/ui/WatchStatusDropdown/config";
import type { AnimeDetailData, VideoResult } from "./types";

interface AnimeHeroProps {
  anime: AnimeDetailData;
  trailer: VideoResult | undefined;
  initialFavorite?: boolean;
  initialWatchStatus?: WatchStatus | null;
}

export default function AnimeHero({ anime, trailer, initialFavorite, initialWatchStatus }: AnimeHeroProps) {
  return (
    <section className="section section--head section--head-fixed section--gradient section--details-bg relative overflow-hidden pb-16 pt-32 -mt-36 bg-bg-main">
      <div className="absolute top-0 left-0 right-0 h-96 w-full z-0">
        <Image
          src={getImageUrl(anime.backdrop_path || anime.poster_path, "original")}
          alt={anime.title}
          fill
          sizes="100vw"
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
              <WatchStatusWrapper animeId={anime.id} initialStatus={initialWatchStatus} />
              <FavoriteButton animeId={anime.id} initialFavorite={initialFavorite} variant="featured" />
            </div>

            <div className="article__content mb-10">
              <h1 className="text-4xl text-white font-rubik font-normal mb-6 leading-tight">
                {anime.title}
              </h1>

              <ul className="flex flex-wrap items-center gap-6 mb-6 text-text-main font-inter text-base">
                <li className="flex items-center gap-1.5 text-white">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    className="w-5 h-5 fill-primary"
                  >
                    <path d="M22,9.67A1,1,0,0,0,21.14,9l-5.69-.83L12.9,3a1,1,0,0,0-1.8,0L8.55,8.16,2.86,9a1,1,0,0,0-.81.68,1,1,0,0,0,.25,1l4.13,4-1,5.68A1,1,0,0,0,6.9,21.44L12,18.77l5.1,2.67a.93.93,0,0,0,.46.12,1,1,0,0,0,.59-.19,1,1,0,0,0,.4-1l-1-5.68,4.13-4A1,1,0,0,0,22,9.67Zm-6.15,4a1,1,0,0,0-.29.88l.72,4.2-3.76-2a1.06,1.06,0,0,0-.94,0l-3.76,2,.72-4.2a1,1,0,0,0-.29-.88l-3-3,4.21-.61a1,1,0,0,0,.76-.55L12,5.7l1.88,3.82a1,1,0,0,0,.76.55l4.21.61Z" />
                  </svg>
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
