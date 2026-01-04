import { NextRequest, NextResponse } from "next/server";

import { createClient } from "@/shared/lib/supabase/server";
import { parseSearchParams,searchQuerySchema } from "@/shared/lib/validations/api";

export async function GET(request: NextRequest) {
    const validation = parseSearchParams(request.nextUrl.searchParams, searchQuerySchema);
    
    if (!validation.success) {
        return NextResponse.json({ results: [] });
    }

    const { q: query } = validation.data;
    const supabase = await createClient();

    const { data: animes, error } = await supabase
        .from("animes")
        .select("id, title, original_title, slug, poster_path, media_type, release_date, vote_average")
        .or(`title.ilike.%${query}%,original_title.ilike.%${query}%`)
        .order("vote_average", { ascending: false })
        .limit(6);

    if (error) {
        return NextResponse.json({ results: [], error: error.message }, { status: 500 });
    }

    return NextResponse.json({ results: animes || [] });
}

