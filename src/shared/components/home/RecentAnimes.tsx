import { ArrowRight } from "lucide-react";
import Link from "next/link";

import { MediaGridServer } from "@/features/anime/components/MediaGrid";
import Container from "@/shared/components/container";

export default async function RecentAnimes() {
    return (
        <section className="pb-12 pt-4">
            <Container>
                <div className="flex items-center justify-between mb-8">
                    <h2 className="text-2xl sm:text-3xl font-bold font-rubik text-white drop-shadow-md border-l-4 border-primary pl-4">
                        AnimeModu&apos;nda Yeni
                    </h2>
                    <Link
                        href="/kesfet"
                        className="flex items-center gap-2 text-sm font-bold text-primary hover:text-white transition-colors group"
                    >
                        Tümünü Gör
                        <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Link>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 sm:gap-8">
                    <MediaGridServer
                        mediaType="all"
                        limit={12}
                        emptyTitle="Henüz İçerik Eklenmemiş"
                        emptyDescription="Panel → Yeni Ekle'den içerik ekleyebilirsin."
                        priorityCount={4}
                    />
                </div>
            </Container>
        </section>
    );
}
