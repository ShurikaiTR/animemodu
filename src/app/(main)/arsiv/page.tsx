import Container from "@/components/ui/container";
import ArchiveSidebar from "@/components/archive/ArchiveSidebar";
import ArchiveGrid from "@/components/archive/ArchiveGrid";
import { Suspense } from "react";
import { ArchiveGridSkeleton } from "@/components/ui/MovieCard/skeleton";
import { createClient } from "@/lib/supabase/server";
import type { AnimeRow } from "@/types/helpers";
import { Button } from "@/components/ui/button";
import { ChevronDown } from "lucide-react";

function ArchiveLoading() {
    return (
        <ArchiveGridSkeleton />
    );
}

export default async function ArchivePage({ searchParams }: { searchParams: Promise<{ [key: string]: string | string[] | undefined }> }) {
    const supabase = await createClient();
    const params = await searchParams;
    const genreFilter = params.tur as string;
    const sortFilter = params.sirala as string;
    const searchQuery = params.ara as string;

    const { data: rawAnimes } = await supabase
        .from("animes")
        .select("*")
        .order("created_at", { ascending: false });

    const allAnimes: AnimeRow[] = rawAnimes || [];

    let filteredAnimes = allAnimes || [];

    if (genreFilter && genreFilter !== "hepsi") {
        const selectedGenres = genreFilter.split(",").filter(Boolean);

        filteredAnimes = filteredAnimes.filter(a => {
            if (!a.genres) return false;
            const animeGenres = a.genres.map((g: string) => g.toLowerCase().replace(/ /g, "-").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u"));

            return selectedGenres.every(sg => animeGenres.includes(sg));
        });
    }

    if (searchQuery) {
        const query = searchQuery.toLowerCase();
        filteredAnimes = filteredAnimes.filter(a =>
            a.title.toLowerCase().includes(query) ||
            (a.original_title && a.original_title.toLowerCase().includes(query))
        );
    }

    if (sortFilter) {
        if (sortFilter === "puan") {
            filteredAnimes.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        } else if (sortFilter === "izlenme") {
            filteredAnimes.sort((a, b) => (b.vote_average || 0) - (a.vote_average || 0));
        } else if (sortFilter === "yeni") {
            filteredAnimes.sort((a, b) => new Date(b.release_date || 0).getTime() - new Date(a.release_date || 0).getTime());
        }
    }

    const allGenres = new Set<string>();
    allAnimes?.forEach(anime => {
        if (anime.genres && Array.isArray(anime.genres)) {
            anime.genres.forEach((g: string) => allGenres.add(g));
        }
    });

    const availableGenres = Array.from(allGenres).map(g => ({
        label: g,
        value: g.toLowerCase().replace(/ /g, "-").replace(/ç/g, "c").replace(/ğ/g, "g").replace(/ı/g, "i").replace(/ö/g, "o").replace(/ş/g, "s").replace(/ü/g, "u")
    })).sort((a, b) => a.label.localeCompare(b.label));

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
                            <h1 className="text-3xl font-bold text-white font-rubik tracking-tight mb-2">Anime Arşivi</h1>
                            <p className="text-text-main/60 text-sm">
                                Toplam <span className="text-primary font-bold">{filteredAnimes.length}</span> içerik listeleniyor.
                            </p>
                        </div>

                        <Suspense fallback={<ArchiveLoading />}>
                            <ArchiveGrid animes={filteredAnimes} />
                        </Suspense>

                        {filteredAnimes && filteredAnimes.length > 20 && (
                            <div className="mt-16 flex justify-center">
                                <Button variant="glass" size="lg" className="group">
                                    Daha Fazla Göster
                                    <ChevronDown className="w-4 h-4 group-hover:translate-y-1 transition-transform" />
                                </Button>
                            </div>
                        )}

                    </div>

                </div>
            </Container>
        </div>
    );
}
