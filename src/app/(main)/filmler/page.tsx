import { Film } from "lucide-react";
import MediaListPage from "@/components/layout/MediaListPage";
import MoviesListServer from "./MoviesListServer";

export const metadata = {
    title: "Filmler - AnimeModu",
    description: "En yeni ve popüler anime filmlerini keşfet.",
};

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
