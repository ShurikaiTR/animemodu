import type { ReportWithDetails } from "@/types/helpers";

/**
 * Returns a styled status badge JSX element
 */
export function getStatusBadge(status: string) {
    switch (status) {
        case 'resolved':
            return <span className="px-2 py-1 rounded-md bg-green-500/10 text-green-500 text-xs font-medium border border-green-500/20">Çözüldü</span>;
        case 'dismissed':
            return <span className="px-2 py-1 rounded-md bg-red-500/10 text-red-500 text-xs font-medium border border-red-500/20">Reddedildi</span>;
        default:
            return <span className="px-2 py-1 rounded-md bg-yellow-500/10 text-yellow-500 text-xs font-medium border border-yellow-500/20">Beklemede</span>;
    }
}

/**
 * Converts a reason code to a human-readable label
 */
export function getReasonLabel(reason: string): string {
    const reasons: Record<string, string> = {
        'playback': 'Video Açılmıyor',
        'audio': 'Ses Sorunu',
        'subtitle': 'Altyazı Hatalı',
        'wrong': 'Yanlış Bölüm'
    };
    return reasons[reason] || reason;
}

/**
 * Gets the poster path from a report item
 */
export function getAnimePosterPath(item: ReportWithDetails): string | null {
    return item.anime?.poster_path || null;
}

/**
 * Gets the anime title from a report item
 */
export function getAnimeTitle(item: ReportWithDetails): string {
    return item.anime?.title || "Bilinmiyor";
}
