import { LayoutGrid } from "lucide-react";
import MediaListPage from "@/shared/components/layout/MediaListPage";
import AnimesListServer from "./AnimesListServer";

export const metadata = {
    title: "Animeler - AnimeModu",
    description: "En yeni ve popüler animeleri keşfet.",
};

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
