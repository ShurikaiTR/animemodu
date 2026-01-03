"use client";

import { useState, useTransition } from "react";
import { Button } from "@/shared/components/button";
import { updateSiteInfo } from "@/features/settings/actions";
import { toast } from "sonner";
import { Save } from "lucide-react";
import SettingsTabs, { type SettingsTab } from "./SettingsTabs";
import GeneralSettingsTab from "./tabs/GeneralSettingsTab";
import SeoSettingsTab from "./tabs/SeoSettingsTab";

interface SiteInfoFormProps {
    initialSettings: Record<string, string>;
}

export default function SiteInfoForm({ initialSettings }: SiteInfoFormProps) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState(initialSettings);
    const [activeTab, setActiveTab] = useState<SettingsTab>("general");
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);
    const [ogImageFile, setOgImageFile] = useState<File | null>(null);

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        // General settings
        formData.append("site_name", settings.site_name || "");
        formData.append("site_footer_text", settings.site_footer_text || "");
        // SEO settings
        formData.append("seo_meta_title", settings.seo_meta_title || "");
        formData.append("seo_meta_description", settings.seo_meta_description || "");
        formData.append("seo_keywords", settings.seo_keywords || "");
        // Feature toggles
        formData.append("maintenance_mode", settings.maintenance_mode || "false");
        formData.append("watch_together", settings.watch_together || "false");
        // Social media
        formData.append("social_x", settings.social_x || "");
        formData.append("social_instagram", settings.social_instagram || "");
        formData.append("social_telegram", settings.social_telegram || "");
        formData.append("social_discord", settings.social_discord || "");
        formData.append("social_reddit", settings.social_reddit || "");

        if (logoFile) formData.append("site_logo", logoFile);
        if (faviconFile) formData.append("site_favicon", faviconFile);
        if (ogImageFile) formData.append("seo_og_image", ogImageFile);

        startTransition(async () => {
            const result = await updateSiteInfo(formData);

            if (result.success) {
                toast.success("Ayarlar kaydedildi! ✨");
                setLogoFile(null);
                setFaviconFile(null);
                setOgImageFile(null);
            } else {
                toast.error(result.error || "Kayıt başarısız oldu.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tab Navigation */}
            <SettingsTabs activeTab={activeTab} onTabChange={setActiveTab} />

            {/* Tab Content */}
            <div className="min-h-96">
                {activeTab === "general" && (
                    <GeneralSettingsTab
                        settings={settings}
                        onChange={handleChange}
                        onLogoChange={setLogoFile}
                        onFaviconChange={setFaviconFile}
                    />
                )}
                {activeTab === "seo" && (
                    <SeoSettingsTab
                        settings={settings}
                        onChange={handleChange}
                        onOgImageChange={setOgImageFile}
                    />
                )}
            </div>

            {/* Submit Button */}
            <div className="flex justify-end">
                <Button
                    type="submit"
                    disabled={isPending}
                    size="lg"
                    className="bg-primary hover:bg-primary/90 text-white font-bold shadow-lg shadow-primary/20 gap-2 px-8 h-12"
                >
                    {isPending ? (
                        <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            Kaydediliyor...
                        </>
                    ) : (
                        <>
                            <Save className="w-4 h-4" />
                            Değişiklikleri Kaydet
                        </>
                    )}
                </Button>
            </div>
        </form>
    );
}
