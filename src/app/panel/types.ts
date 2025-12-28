import type { Database } from "@/shared/types/supabase";

export type AnimeRow = Database["public"]["Tables"]["animes"]["Row"];

export interface SearchResult {
  id: number;
  title?: string;
  name?: string;
  original_title?: string;
  original_name?: string;
  media_type: "movie" | "tv";
  poster_path: string | null;
  backdrop_path: string | null;
  overview: string;
  release_date?: string;
  first_air_date?: string;
  vote_average: number;
}

export interface TMDBGenre {
  id: number;
  name: string;
}

export interface TMDBDetails {
  genres?: TMDBGenre[];
}
