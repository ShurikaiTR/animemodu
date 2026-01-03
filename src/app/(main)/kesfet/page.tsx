import { Suspense } from "react";
import Container from "@/shared/components/container";
import ArchiveSidebar from "@/shared/components/archive/ArchiveSidebar";
import ArchiveGrid from "@/shared/components/archive/ArchiveGrid";
import { Pagination } from "@/shared/components/Pagination";
import { ArchiveGridSkeleton } from "@/shared/components/MovieCard/skeleton";
import { createClient } from "@/shared/lib/supabase/server";
import { slugifyTurkish } from "@/shared/lib/utils";
import { PAGINATION } from "@/shared/lib/constants";
import type { AnimeRow } from "@/shared/types/helpers";

const ITEMS_PER_PAGE = PAGINATION.DEFAULT_PAGE_SIZE;

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ArchivePage({ searchParams }: PageProps) {
    const supabase = await createClient();
    const params = await searchParams;

    // Parse URL parameters
    const genreFilter = params.tur as string | undefined;
    const sortFilter = params.sirala as string | undefined;
    const searchQuery = params.ara as string | undefined;
    const currentPage = Math.max(1, parseInt(params.sayfa as string) || 1);

    // Build optimized Supabase query
    let query = supabase.from("animes").select("*", { count: "exact" });

    // Apply search filter at DB level
    if (searchQuery) {
        query = query.or(`title.ilike.%${searchQuery}%,original_title.ilike.%${searchQuery}%`);
    }

    // Apply sorting
    if (sortFilter === "puan") {
        query = query.order("vote_average", { ascending: false, nullsFirst: false });
    } else if (sortFilter === "yeni") {
        query = query.order("release_date", { ascending: false, nullsFirst: false });
    } else {
        query = query.order("created_at", { ascending: false });
    }

    // Apply pagination
    const offset = (currentPage - 1) * ITEMS_PER_PAGE;
    query = query.range(offset, offset + ITEMS_PER_PAGE - 1);

    const { data: rawAnimes, count } = await query;
    let animes: AnimeRow[] = (rawAnimes || []) as AnimeRow[];

    // Genre filtering (still in JS because genres is an array column)
    if (genreFilter && genreFilter !== "hepsi") {
        const selectedGenres = genreFilter.split(",").filter(Boolean);
        animes = animes.filter(a => {
            if (!a.genres) return false;
            const animeGenres = a.genres.map((g: string) => slugifyTurkish(g));
            return selectedGenres.every(sg => animeGenres.includes(sg));
        });
    }

    const totalItems = count || 0;
    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE);

    // Get all genres for sidebar (separate optimized query)
    const { data: genreData } = await supabase
        .from("animes")
        .select("genres");

    const allGenres = new Set<string>();
    (genreData || []).forEach((anime: { genres: string[] | null }) => {
        if (anime.genres && Array.isArray(anime.genres)) {
            anime.genres.forEach((g: string) => allGenres.add(g));
        }
    });

    const availableGenres = Array.from(allGenres)
        .map(g => ({ label: g, value: slugifyTurkish(g) }))
        .sort((a, b) => a.label.localeCompare(b.label, "tr"));

    return (
        <div className="pb-16 min-h-screen bg-bg-main">
            <Container>
                <div className="flex flex-col lg:flex-row gap-0 lg:gap-10 items-start">
                    <div className="w-full lg:w-64 shrink-0 lg:sticky lg:top-24">
                        <Suspense fallback={<div>Yükleniyor...</div>}>
                            <ArchiveSidebar genres={availableGenres} />
                        </Suspense>
                    </div>

                    <div className="flex-1 w-full">
                        <div className="mb-8">
                            <h1 className="text-3xl font-bold text-white font-rubik tracking-tight mb-2">
                                Keşfet
                            </h1>
                            <p className="text-text-main/60 text-sm">
                                Toplam <span className="text-primary font-bold">{totalItems}</span> içerik
                                {totalPages > 1 && ` • Sayfa ${currentPage}/${totalPages}`}
                            </p>
                        </div>

                        <Suspense fallback={<ArchiveGridSkeleton />}>
                            <ArchiveGrid animes={animes} />
                        </Suspense>

                        <Pagination currentPage={currentPage} totalPages={totalPages} variant="full" pageParam="sayfa" />
                    </div>
                </div>
            </Container>
        </div>
    );
}
