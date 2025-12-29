import { MediaGridServer } from "@/features/anime/components/MediaGrid";

export default async function AnimesListServer() {
    return (
        <MediaGridServer
            mediaType="tv"
            emptyIcon="layout-grid"
            emptyTitle="Henüz Anime Eklenmemiş"
            emptyDescription="Şu anda görüntülenecek anime bulunmuyor. Daha sonra tekrar kontrol et."
        />
    );
}
