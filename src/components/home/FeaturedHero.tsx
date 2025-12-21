import { createPublicClient } from "@/lib/supabase/server";
import { cacheLife, cacheTag } from "next/cache";
import HeroSection from "./HeroSection";

export default async function FeaturedHero() {
  "use cache";
  cacheLife("minutes");
  cacheTag("featured-anime");

  const supabase = createPublicClient();
  
  const { data: featured } = await supabase
    .from("animes")
    .select("*")
    .eq("is_featured", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle();

  return <HeroSection featuredAnime={featured} />;
}


