import { Suspense } from "react";
import type { Metadata } from "next";
import { getSiteInfo } from "@/features/settings/actions";
import { getAnimeBySlug } from "@/shared/lib/anime/queries";
import { getImageUrl } from "@/shared/lib/tmdb";
import VideoPlayerServer from "./VideoPlayerServer";
import Loading from "./loading";

interface PageProps {
    params: Promise<{ slug: string; segments: string[] }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const siteInfo = await getSiteInfo();
    const { slug, segments } = await params;
    const dbAnime = await getAnimeBySlug(slug);

    if (!dbAnime) {
        return { title: "Anime Bulunamadı" };
    }

    // Try to get episode number from segments (usually the last segment if it's dynamic)
    const episodeNumber = segments[segments.length - 1] || "1";

    const title = siteInfo.seo_watch_title
        .replace(/{anime_title}/g, dbAnime.title)
        .replace(/{episode_number}/g, episodeNumber);

    const description = siteInfo.seo_watch_description
        .replace(/{anime_title}/g, dbAnime.title)
        .replace(/{episode_number}/g, episodeNumber);

    return {
        title,
        description,
        openGraph: {
            title,
            description,
            images: dbAnime.backdrop_path ? [getImageUrl(dbAnime.backdrop_path, "original")] : undefined,
        }
    };
}

export default async function WatchPage({ params }: PageProps) {
    const { slug, segments } = await params;

    return (
        <Suspense fallback={<Loading />}>
            <VideoPlayerServer slug={slug} segments={segments} />
        </Suspense>
    );
}
