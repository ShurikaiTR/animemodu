import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { SettingsService } from "@/features/settings/services/settings-service";
import { Button } from "@/shared/components/button";

import SiteInfoForm from "./SiteInfoForm";

export default async function SettingsContent() {
    let settingsMap: Record<string, string> = {};

    try {
        settingsMap = await SettingsService.getAllSettings();
    } catch (error) {
        console.error("Settings load error:", error);
        // Error state handled gracefully by empty map for form
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500 pb-20 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex flex-col gap-6 pb-6 border-b border-white/5">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <Link href="/panel">
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-text-main hover:text-white hover:bg-white/5">
                                <ArrowLeft className="w-5 h-5" />
                            </Button>
                        </Link>
                        <div>
                            <h2 className="text-3xl font-rubik font-bold text-white mb-2 flex items-center gap-3">
                                Site Ayarları
                            </h2>
                            <p className="text-text-main/60 text-sm">
                                Sitenin genel bilgilerini buradan düzenleyebilirsiniz.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <SiteInfoForm initialSettings={settingsMap} />
        </div>
    );
}
