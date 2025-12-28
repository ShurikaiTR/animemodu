import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';
import { createPublicClient } from '@/shared/lib/supabase/server';

async function getBaseUrl(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = await getBaseUrl();

    // Statik sayfalar
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/animeler`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/filmler`,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 0.9,
        },
        {
            url: `${baseUrl}/takvim`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.7,
        },
    ];

    // Dinamik anime sayfaları
    try {
        const supabase = createPublicClient();
        const { data: animes } = await supabase
            .from('animes')
            .select('slug, updated_at')
            .order('updated_at', { ascending: false })
            .limit(1000);

        type AnimeData = { slug: string; updated_at: string | null };
        const animePages: MetadataRoute.Sitemap = ((animes || []) as AnimeData[]).map((anime) => ({
            url: `${baseUrl}/anime/${anime.slug}`,
            lastModified: anime.updated_at ? new Date(anime.updated_at) : new Date(),
            changeFrequency: 'weekly' as const,
            priority: 0.8,
        }));

        return [...staticPages, ...animePages];
    } catch {
        return staticPages;
    }
}
