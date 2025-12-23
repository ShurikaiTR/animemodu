import { createClient } from "@/lib/supabase/server";
import MoviesClient from "./MoviesClient";
import type { AnimeRow } from "../types";

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
