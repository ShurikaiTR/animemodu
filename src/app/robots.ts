import type { MetadataRoute } from 'next';
import { headers } from 'next/headers';

async function getBaseUrl(): Promise<string> {
    const headersList = await headers();
    const host = headersList.get('host') || 'localhost:3000';
    const protocol = headersList.get('x-forwarded-proto') || 'https';
    return `${protocol}://${host}`;
}

export default async function robots(): Promise<MetadataRoute.Robots> {
    const baseUrl = await getBaseUrl();

    return {
        rules: [
            {
                userAgent: '*',
                allow: '/',
                disallow: ['/panel/', '/api/', '/auth/'],
            },
        ],
        sitemap: `${baseUrl}/sitemap.xml`,
    };
}
