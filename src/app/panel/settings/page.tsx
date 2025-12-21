import { Suspense } from "react";
import SettingsContent from "./SettingsContent";
import SettingsLoading from "./loading";

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

