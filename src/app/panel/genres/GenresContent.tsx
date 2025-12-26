import { createClient } from "@/lib/supabase/server";
import { GenresTable, type GenreItem } from "@/components/panel/tables/GenresTable";

export async function GenresContent() {
    const supabase = await createClient();

    // Fetch all animes with genres
    const { data: animes } = await supabase
        .from("animes")
        .select("genres");

    // Count genres from all animes
    const genreCounts = new Map<string, number>();

    type AnimeGenre = { genres: string[] | null };
    ((animes || []) as AnimeGenre[]).forEach((anime) => {
        if (anime.genres && Array.isArray(anime.genres)) {
            anime.genres.forEach((genre) => {
                genreCounts.set(genre, (genreCounts.get(genre) || 0) + 1);
            });
        }
    });

    // Convert to sorted array
    const genres: GenreItem[] = Array.from(genreCounts.entries())
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count);



    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-wrap items-center justify-between pb-6 border-b border-white/5">
                <div>
                    <h2 className="text-3xl font-rubik font-bold text-white mb-1">Türler</h2>
                    <p className="text-text-main/60 text-sm">
                        Tüm anime türlerini buradan görüntüleyebilir ve yönetebilirsin.
                    </p>
                </div>
            </div>

            <GenresTable items={genres} />
        </div>
    );
}
