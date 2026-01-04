import { Film } from "lucide-react";
import type { Metadata } from "next";

import { SettingsService } from "@/features/settings/services/settings-service";
import MediaListPage from "@/shared/components/layout/MediaListPage";

import MoviesListServer from "./MoviesListServer";

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await SettingsService.getAllSettings();
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
