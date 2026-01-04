import { NextResponse } from "next/server";

import { createClient } from "@/shared/lib/supabase/server";

/**
 * GET /api/random
 * Rastgele bir anime seçip o animeye yönlendirir.
 */
export async function GET() {
    const supabase = await createClient();

    // Toplam anime sayısını al
    const { count } = await supabase
        .from("animes")
        .select("*", { count: "exact", head: true })
        .eq("is_visible", true);

    if (!count || count === 0) {
        // Anime yoksa anasayfaya yönlendir
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
    }

    // Rastgele bir offset seç
    const randomOffset = Math.floor(Math.random() * count);

    // Rastgele anime'yi getir
    const { data: randomAnime } = await supabase
        .from("animes")
        .select("slug")
        .eq("is_visible", true)
        .range(randomOffset, randomOffset)
        .single();

    if (!randomAnime?.slug) {
        return NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
    }

    // Anime sayfasına yönlendir
    return NextResponse.redirect(new URL(`/anime/${randomAnime.slug}`, process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
}
