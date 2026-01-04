import { Calendar,Film, Star } from "lucide-react";
import Image from "next/image";

import { cn } from "@/shared/lib/utils";

interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  backdrop_path: string | null;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

interface AddContentModalHeaderProps {
  item: SearchResult;
}

export function AddContentModalHeader({ item }: AddContentModalHeaderProps) {
  return (
    <div className="relative h-48 w-full">
      <div className="absolute inset-0 relative">
        {item.backdrop_path ? (
          <Image
            src={`https://image.tmdb.org/t/p/w780${item.backdrop_path}`}
            alt="Backdrop"
            fill
            sizes="100vw"
            className="object-cover opacity-50"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-bg-main to-transparent" />
      </div>

      <div className="absolute bottom-5 left-6 right-6 flex items-end gap-5">
        <div className="relative w-24 h-36 rounded-md overflow-hidden border border-white/10 shadow-xl shrink-0 -mb-10 z-10 bg-black/50">
          {item.poster_path ? (
            <Image
              src={`https://image.tmdb.org/t/p/w300${item.poster_path}`}
              alt="Poster"
              fill
              sizes="96px"
              className="object-cover"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-white/20">
              <Film className="w-8 h-8" />
            </div>
          )}
        </div>
        <div className="flex-1 mb-1">
          <h2 className="text-xl font-bold font-rubik text-white shadow-black drop-shadow-md line-clamp-1">
            {item.title || item.name}
          </h2>
          <div className="flex items-center gap-3 text-sm text-gray-300 mt-1">
            <span
              className={cn(
                "px-2 py-0.5 rounded text-xs font-bold border uppercase tracking-wide",
                item.media_type === "movie"
                  ? "bg-purple-500/10 text-purple-300 border-purple-500/20"
                  : "bg-blue-500/10 text-blue-300 border-blue-500/20"
              )}
            >
              {item.media_type === "movie" ? "Film" : "Dizi"}
            </span>
            {item.release_date || item.first_air_date ? (
              <span className="flex items-center gap-1 text-xs">
                <Calendar className="w-3 h-3 text-white/50" />
                {(item.release_date || item.first_air_date)?.substring(0, 4)}
              </span>
            ) : null}
            <span className="flex items-center gap-1 text-xs font-medium text-yellow-500">
              <Star className="w-3 h-3 fill-current" />
              {item.vote_average.toFixed(1)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}












