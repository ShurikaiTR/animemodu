import { Suspense } from "react";

import { SettingsService } from "@/features/settings/services/settings-service";

import HeaderClient from "./HeaderClient";

/**
 * Header bileşeni için Server wrapper.
 * Suspense ile sarmalanarak 'blocking route' hatalarını önler.
 */
async function HeaderServer() {
    const siteInfo = await SettingsService.getAllSettings();

    return (
        <HeaderClient
            siteLogo={siteInfo.site_logo}
            siteName={siteInfo.site_name}
            discordUrl={siteInfo.social_discord}
        />
    );
}

// Yükleme sırasında görünecek basit bir iskelet veya boş alan
function HeaderSkeleton() {
    return <div className="h-20 lg:h-24 bg-transparent border-b border-transparent" />;
}

export default function Header() {
    return (
        <Suspense fallback={<HeaderSkeleton />}>
            <HeaderServer />
        </Suspense>
    );
}
