import type { Metadata } from "next";
import { Film } from "lucide-react";
import MediaListPage from "@/shared/components/layout/MediaListPage";
import MoviesListServer from "./MoviesListServer";
import { getSiteInfo } from "@/features/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await getSiteInfo();
    return {
        title: siteInfo.seo_movies_title,
        description: siteInfo.seo_movies_description,
        openGraph: {
            title: siteInfo.seo_movies_title,
            description: siteInfo.seo_movies_description,
        },
    };
}

export default function MoviesPage() {
    return (
        <MediaListPage
            title="Anime Filmleri"
            description="Soluksuz izleyeceğin anime filmleri burada."
            icon={Film}
        >
            <MoviesListServer />
        </MediaListPage>
    );
}
