import React, { Suspense } from "react";
import { Calendar } from "lucide-react";
import { cacheLife, cacheTag } from "next/cache";
import Container from "@/components/ui/container";
import { createPublicClient } from "@/lib/supabase/server";
import CalendarClient from "@/components/calendar/CalendarClient";

function CalendarLoading() {
    return (
        <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
                <div key={i} className="h-40 w-full bg-white/5 animate-pulse rounded-2xl" />
            ))}
        </div>
    );
}

export default async function CalendarPage() {
    "use cache";
    cacheLife("hours");
    cacheTag("episodes");

    const supabase = createPublicClient();

    const { data: episodes } = await supabase
        .from("episodes")
        .select(`
            id,
            title,
            episode_number,
            air_date,
            anime:animes (
                id,
                title,
                poster_path,
                backdrop_path,
                genres,
                slug
            )
        `)
        .order("air_date", { ascending: true })
        .limit(50);

    type EpisodeData = {
        air_date: string | null;
        id: number;
        title: string | null;
        episode_number: number;
        anime: {
            id: number;
            title: string;
            poster_path: string | null;
            backdrop_path: string | null;
            genres: string[] | null | undefined;
            slug: string;
        } | null;
    };
    const validEpisodes = (episodes as EpisodeData[] | null)?.filter(e => e.air_date) || [];

    return (
        <div className="min-h-screen bg-bg-main pb-20 pt-24 md:pt-32">
            <Container>
                <div className="mb-12">
                    <h1 className="text-4xl md:text-5xl font-bold font-rubik text-white mb-4 flex items-center gap-3">
                        <Calendar className="w-8 h-8 md:w-10 md:h-10 text-primary" />
                        Yayın Takvimi
                    </h1>
                    <p className="text-white/60 text-lg">
                        Haftalık anime yayın akışını takip et, yeni bölümleri kaçırma.
                    </p>
                </div>

                <Suspense fallback={<CalendarLoading />}>
                    <CalendarClient episodes={validEpisodes} />
                </Suspense>

                <div className="mt-12 text-center text-white/40 text-sm">
                    <p>Veriler otomatik olarak güncellenmektedir.</p>
                </div>
            </Container>
        </div>
    );
}
