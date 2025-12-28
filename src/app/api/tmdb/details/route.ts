import { NextRequest, NextResponse } from "next/server";
import { getAnimeDetails } from "@/shared/lib/tmdb";
import { tmdbDetailsQuerySchema, parseSearchParams } from "@/shared/lib/validations/api";

export async function GET(request: NextRequest) {
    const validation = parseSearchParams(request.nextUrl.searchParams, tmdbDetailsQuerySchema);

    if (!validation.success) {
        return NextResponse.json({ error: "Geçersiz parametreler" }, { status: 400 });
    }

    const { id, type } = validation.data;
    const details = await getAnimeDetails(id, type);

    if (!details) {
        return NextResponse.json({ error: "Content not found" }, { status: 404 });
    }

    return NextResponse.json(details);
}

