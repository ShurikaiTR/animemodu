import { MediaGridServer } from "@/components/anime/MediaGrid";

export default async function MoviesListServer() {
    return (
        <MediaGridServer
            mediaType="movie"
            cacheTagName="animes"
            emptyIcon="film"
            emptyTitle="Henüz Film Eklenmemiş"
            emptyDescription="Şu anda görüntülenecek film bulunmuyor. Daha sonra tekrar kontrol et."
            defaultGenre="Film"
        />
    );
}
