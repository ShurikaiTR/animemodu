export interface EditFormData {
  title: string;
  original_title: string;
  slug: string;
  overview: string;
  poster_path: string;
  backdrop_path: string;
  vote_average: number;
  release_date: string;
  structure_type: "seasonal" | "absolute";
  is_featured: boolean;
  trailer_key: string;
  genres: string[];
}
