import { Suspense } from "react";

import SettingsLoading from "./loading";
import SettingsContent from "./SettingsContent";

export const metadata = {
    title: "Ayarlar - Admin Panel",
    description: "Site ayarlarını yönetin.",
};

export default function SettingsPage() {
    return (
        <Suspense fallback={<SettingsLoading />}>
            <SettingsContent />
        </Suspense>
    );
}

