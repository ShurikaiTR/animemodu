import { createClient } from "@/shared/lib/supabase/server";
import { DashboardTable } from "@/components/panel/tables/DashboardTable";
import { Zap } from "lucide-react";

interface TopItem {
  id: number;
  title: string;
  category: string;
  rating: number;
}

export default async function RecentAnimesServer() {
  const supabase = await createClient();

  const { data: recentAnimes } = await supabase
    .from("animes")
    .select("id, title, media_type, is_featured, poster_path")
    .order("created_at", { ascending: false })
    .limit(5);

  type AnimeData = { id: number; title: string; media_type: string | null; is_featured: boolean | null; poster_path: string | null };
  const recentItems: TopItem[] =
    (recentAnimes as AnimeData[] | null)?.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.media_type === "movie" ? "Film" : "Dizi",
      rating: 0,
      poster_path: a.poster_path
    })) || [];

  return <DashboardTable title="Son Eklenenler" icon={Zap} items={recentItems} />;
}


