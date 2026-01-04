import { createClient } from "@/shared/lib/supabase/server";

import type { AnimeRow } from "../types";
import MoviesClient from "./MoviesClient";

export const metadata = {
    title: "Filmler - Admin Panel",
    description: "Film kataloğunu yönetin",
};

export default async function MoviesPage() {
    const supabase = await createClient();

    const { data } = await supabase
        .from("animes")
        .select("*")
        .eq("media_type", "movie")
        .order("created_at", { ascending: false });

    const movies: AnimeRow[] = data || [];

    return <MoviesClient initialMovies={movies} />;
}
