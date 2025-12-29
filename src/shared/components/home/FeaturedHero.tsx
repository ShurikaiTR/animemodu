import { createPublicClient } from "@/shared/lib/supabase/server";
import type { AnimeRow } from "@/shared/types/helpers";
import HeroSection from "./HeroSection";

export default async function FeaturedHero() {
  const supabase = createPublicClient();

  const { data: featured } = await supabase
    .from("animes")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <HeroSection featuredAnime={featured as AnimeRow | null} />;
}
