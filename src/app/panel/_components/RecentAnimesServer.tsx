import { createClient } from "@/lib/supabase/server";
import { DashboardTable } from "@/components/panel/tables/DashboardTable";
import { Film } from "lucide-react";

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
    .select("id, title, media_type, is_featured")
    .order("created_at", { ascending: false })
    .limit(5);

  const recentItems: TopItem[] =
    recentAnimes?.map((a) => ({
      id: a.id,
      title: a.title,
      category: a.media_type === "movie" ? "Film" : "Dizi",
      rating: 0,
    })) || [];

  return <DashboardTable title="Son Eklenenler" icon={Film} items={recentItems} />;
}


