import { LayoutGrid } from "lucide-react";
import type { Metadata } from "next";

import { SettingsService } from "@/features/settings/services/settings-service";
import MediaListPage from "@/shared/components/layout/MediaListPage";

import AnimesListServer from "./AnimesListServer";

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await SettingsService.getAllSettings();
    return {
        title: siteInfo.seo_animes_title,
        description: siteInfo.seo_animes_description,
        openGraph: {
            title: siteInfo.seo_animes_title,
            description: siteInfo.seo_animes_description,
        },
    };
}

export default function AnimesPage() {
    return (
        <MediaListPage
            title="Animeler"
            description="En sevilen anime serilerini keşfet ve izle."
            icon={LayoutGrid}
        >
            <AnimesListServer />
        </MediaListPage>
    );
}
