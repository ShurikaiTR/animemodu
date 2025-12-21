import { createClient } from "@/lib/supabase/server";
import StatCard from "@/components/panel/cards/StatCard";
import { Eye, Plus, MessageSquare, Star } from "lucide-react";
import { formatNumber, calculateChange, getDaysAgo } from "@/lib/panel/utils";

export default async function StatsCardsServer() {
  const supabase = await createClient();

  const thirtyDaysAgo = getDaysAgo(30);
  const sixtyDaysAgo = getDaysAgo(60);

  const [
    { count: totalAnimes },
    { count: newAnimes },
    { count: previousNewAnimes },
    { count: totalComments },
    { count: previousComments },
    { count: totalReviews },
    { count: previousReviews },
  ] = await Promise.all([
    supabase.from("animes").select("*", { count: "exact", head: true }),
    supabase.from("animes").select("*", { count: "exact", head: true }).gte("created_at", thirtyDaysAgo.toISOString()),
    supabase.from("animes").select("*", { count: "exact", head: true }).gte("created_at", sixtyDaysAgo.toISOString()).lt("created_at", thirtyDaysAgo.toISOString()),
    supabase.from("comments").select("*", { count: "exact", head: true }),
    supabase.from("comments").select("*", { count: "exact", head: true }).lt("created_at", thirtyDaysAgo.toISOString()),
    supabase.from("reviews").select("*", { count: "exact", head: true }),
    supabase.from("reviews").select("*", { count: "exact", head: true }).lt("created_at", thirtyDaysAgo.toISOString()),
  ]);

  const newAnimesChange = calculateChange(newAnimes, previousNewAnimes);
  const commentsChange = calculateChange(totalComments, previousComments);
  const reviewsChange = calculateChange(totalReviews, previousReviews);

  const STATS = [
    { title: "Toplam İçerik", value: formatNumber(totalAnimes), icon: Eye, change: "", trend: "up" as const },
    { title: "Yeni İçerik (30 gün)", value: formatNumber(newAnimes), icon: Plus, change: newAnimesChange.change, trend: newAnimesChange.trend },
    { title: "Yorumlar", value: formatNumber(totalComments), icon: MessageSquare, change: commentsChange.change, trend: commentsChange.trend },
    { title: "İncelemeler", value: formatNumber(totalReviews), icon: Star, change: reviewsChange.change, trend: reviewsChange.trend },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
      {STATS.map((stat, idx) => (
        <StatCard key={idx} {...stat} />
      ))}
    </div>
  );
}

