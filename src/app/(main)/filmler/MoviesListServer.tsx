import { MediaGridServer } from "@/features/anime/components/MediaGrid";

export default async function MoviesListServer() {
    return (
        <MediaGridServer
            mediaType="movie"
            emptyIcon="film"
            emptyTitle="Henüz Film Eklenmemiş"
            emptyDescription="Şu anda görüntülenecek film bulunmuyor. Daha sonra tekrar kontrol et."
        />
    );
}
