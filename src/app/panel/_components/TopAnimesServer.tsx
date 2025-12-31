import { createClient } from "@/shared/lib/supabase/server";
import { DashboardTable } from "@/components/panel/tables/DashboardTable";
import { Flame } from "lucide-react";

interface TopItem {
  id: number;
  title: string;
  category: string;
  rating: number;
}

export default async function TopAnimesServer() {
  const supabase = await createClient();

  const { data: topAnimes } = await supabase
    .from("animes")
    .select("id, title, media_type, vote_average, poster_path")
    .order("vote_average", { ascending: false })
    .limit(5);

  type AnimeData = { id: number; title: string; media_type: string | null; vote_average: number | null; poster_path: string | null };
  const topItems: TopItem[] =
    (topAnimes as AnimeData[] | null)?.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.media_type === "movie" ? "Film" : "Dizi",
      rating: a.vote_average ? Math.round(a.vote_average * 10) / 10 : 0,
      poster_path: a.poster_path
    })) || [];

  return <DashboardTable title="Popüler İçerikler" icon={Flame} items={topItems} showRating />;
}


