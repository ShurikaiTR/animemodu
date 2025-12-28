import Container from "@/shared/components/container";
import { MediaGridServer } from "@/features/anime/components/MediaGrid";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default async function PopularMovies() {
    return (
        <section className="pb-20 pt-8">
            <Container>
                <div className="flex items-center justify-between mb-12">
                    <h2 className="text-2xl sm:text-3xl font-bold font-rubik text-white drop-shadow-md border-l-4 border-primary pl-4">
                        Popüler Anime Filmleri
                    </h2>
                    <Link
                        href="/arsiv?type=movie"
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors group"
                    >
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                    <MediaGridServer
                        mediaType="movie"
                        cacheTagName="animes"
                        limit={6}
                        orderBy="vote_average"
                        orderDirection="desc"
                        emptyTitle="Henüz Film Eklenmemiş"
                        emptyDescription="Panel → Yeni Ekle'den film ekleyebilirsin."
                    />
                </div>
            </Container>
        </section>
    );
}
