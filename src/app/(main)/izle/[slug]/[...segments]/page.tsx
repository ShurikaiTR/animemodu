import type { Metadata } from "next";
import { Suspense } from "react";

import { SettingsService } from "@/features/settings/services/settings-service";
import { getAnimeBySlug } from "@/shared/lib/anime/queries";
import { getImageUrl } from "@/shared/lib/tmdb";

import Loading from "./loading";
import VideoPlayerServer from "./VideoPlayerServer";

interface PageProps {
    params: Promise<{ slug: string; segments: string[] }>;
}

function parseEpisodeInfo(segments: string[]): { season: number; episode: number } {
    // Seasonal format: ["sezon-3", "bolum-12"]
    // Absolute format: ["bolum-45"]

    if (segments.length === 2) {
        // Seasonal
        const seasonMatch = segments[0]?.match(/^sezon-(\d+)$/i);
        const episodeMatch = segments[1]?.match(/^bolum-(\d+)$/i);
        return {
            season: seasonMatch ? parseInt(seasonMatch[1]) : 1,
            episode: episodeMatch ? parseInt(episodeMatch[1]) : 1
        };
    } else if (segments.length === 1) {
        // Absolute
        const episodeMatch = segments[0]?.match(/^bolum-(\d+)$/i);
        return {
            season: 1,
            episode: episodeMatch ? parseInt(episodeMatch[1]) : 1
        };
    }

    return { season: 1, episode: 1 };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const siteInfo = await SettingsService.getAllSettings();
    const { slug, segments } = await params;
    const dbAnime = await getAnimeBySlug(slug);

    if (!dbAnime) {
        return { title: "Anime Bulunamadı" };
    }

    const { season, episode } = parseEpisodeInfo(segments);

    // Akıllı Bölüm Etiketi
    const episodeLabel = segments.length === 2
        ? `${season}. Sezon ${episode}. Bölüm`
        : `${episode}. Bölüm`;

    const yearLabel = dbAnime.release_date ? new Date(dbAnime.release_date).getFullYear().toString() : "";
    const genresLabel = dbAnime.genres?.join(", ") || "";
    const overviewLabel = dbAnime.overview || "";

    const title = siteInfo.seo_watch_title
        .replace(/{anime_title}/g, dbAnime.title)
        .replace(/{episode}/g, episodeLabel)
        .replace(/{year}/g, yearLabel)
        .replace(/{genres}/g, genresLabel);

    const description = siteInfo.seo_watch_description
        .replace(/{anime_title}/g, dbAnime.title)
        .replace(/{episode}/g, episodeLabel)
        .replace(/{year}/g, yearLabel)
        .replace(/{genres}/g, genresLabel)
        .replace(/{overview}/g, overviewLabel);

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
