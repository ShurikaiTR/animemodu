import type { Metadata } from "next";
import { LayoutGrid } from "lucide-react";
import MediaListPage from "@/shared/components/layout/MediaListPage";
import AnimesListServer from "./AnimesListServer";
import { getSiteInfo } from "@/features/settings/actions";

export async function generateMetadata(): Promise<Metadata> {
    const siteInfo = await getSiteInfo();
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
