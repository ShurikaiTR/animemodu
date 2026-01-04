import { NextRequest, NextResponse } from "next/server";

import { searchMulti } from "@/shared/lib/tmdb/api";
import { parseSearchParams,tmdbSearchQuerySchema } from "@/shared/lib/validations/api";

export async function GET(request: NextRequest) {
    const validation = parseSearchParams(request.nextUrl.searchParams, tmdbSearchQuerySchema);

    if (!validation.success) {
        return NextResponse.json({ results: [] });
    }

    const { query } = validation.data;

    try {
        const results = await searchMulti(query);
        return NextResponse.json({ results });
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Failed to search TMDB";
        return NextResponse.json(
            { error: errorMessage },
            { status: 500 }
        );
    }
}
