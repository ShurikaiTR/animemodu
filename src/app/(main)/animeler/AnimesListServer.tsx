import { MediaGridServer } from "@/components/anime/MediaGrid";

export default async function AnimesListServer() {
    return (
        <MediaGridServer
            mediaType="tv"
            cacheTagName="animes"
            emptyIcon="layout-grid"
            emptyTitle="Henüz Anime Eklenmemiş"
            emptyDescription="Şu anda görüntülenecek anime bulunmuyor. Daha sonra tekrar kontrol et."
            defaultGenre="Anime"
        />
    );
}
