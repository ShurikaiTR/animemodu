import { createPublicClient } from "@/shared/lib/supabase/server";
import MovieCard from "@/shared/components/MovieCard";
import EmptyState from "@/shared/components/EmptyState";
import { getImageUrl } from "@/shared/lib/tmdb";
import { LayoutGrid, Film, Inbox } from "lucide-react";

export type MediaType = "tv" | "movie" | "all";
export type EmptyIconType = "layout-grid" | "film" | "inbox";

// Icon mapping - Server Component'lara fonksiyon geçirilemediği için string key kullanıyoruz
const ICON_MAP = {
    "layout-grid": LayoutGrid,
    "film": Film,
    "inbox": Inbox,
} as const;

/** Supabase query sonucu için interface */
interface MediaGridItem {
    id: string;
    title: string;
    release_date: string | null;
    genres: string[] | null;
    vote_average: number | null;
    poster_path: string | null;
    slug: string | null;
    media_type: string | null;
}

interface MediaGridServerProps {
    /** Filter by media type: "tv" for anime series, "movie" for films, "all" for both */
    mediaType?: MediaType;
    /** Maximum number of items to display */
    limit?: number;
    /** Icon key for empty state (use string key, not component) */
    emptyIcon?: EmptyIconType;
    /** Title for empty state */
    emptyTitle?: string;
    /** Description for empty state */
    emptyDescription?: string;
    /** Order by field */
    orderBy?: "created_at" | "vote_average";
    /** Order direction */
    orderDirection?: "asc" | "desc";
}

export default async function MediaGridServer({
    mediaType = "all",
    limit,
    emptyIcon = "layout-grid",
    emptyTitle = "Henüz İçerik Eklenmemiş",
    emptyDescription = "Şu anda görüntülenecek içerik bulunmuyor. Daha sonra tekrar kontrol et.",
    orderBy = "created_at",
    orderDirection = "desc",
}: MediaGridServerProps) {
    const supabase = createPublicClient();

    let query = supabase
        .from("animes")
        .select("id, title, release_date, genres, vote_average, poster_path, slug, media_type")
        .order(orderBy, { ascending: orderDirection === "asc" });

    // Apply media type filter
    if (mediaType === "tv") {
        query = query.neq("media_type", "movie");
    } else if (mediaType === "movie") {
        query = query.eq("media_type", "movie");
    }

    // Apply limit if specified
    if (limit) {
        query = query.limit(limit);
    }

    const { data } = await query;
    const items = data as MediaGridItem[] | null;

    if (!items || items.length === 0) {
        const IconComponent = ICON_MAP[emptyIcon];
        return (
            <EmptyState
                icon={IconComponent}
                title={emptyTitle}
                description={emptyDescription}
            />
        );
    }

    return (
        <>
            {items.map((item) => (
                <MovieCard
                    key={item.id}
                    id={item.id}
                    title={item.title}
                    year={item.release_date ? parseInt(item.release_date.split("-")[0]) : 0}
                    genres={item.genres}
                    rating={item.vote_average || 0}
                    image={getImageUrl(item.poster_path, "w500")}
                    slug={item.slug || undefined}
                />
            ))}
        </>
    );
}
