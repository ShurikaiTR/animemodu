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
        // SEO settings - Home
        formData.append("seo_home_title", settings.seo_home_title || "");
        formData.append("seo_home_description", settings.seo_home_description || "");
        // SEO - Discover
        formData.append("seo_discover_title", settings.seo_discover_title || "");
        formData.append("seo_discover_description", settings.seo_discover_description || "");
        // SEO - Animes
        formData.append("seo_animes_title", settings.seo_animes_title || "");
        formData.append("seo_animes_description", settings.seo_animes_description || "");
        // SEO - Movies
        formData.append("seo_movies_title", settings.seo_movies_title || "");
        formData.append("seo_movies_description", settings.seo_movies_description || "");
        // SEO - Calendar
        formData.append("seo_calendar_title", settings.seo_calendar_title || "");
        formData.append("seo_calendar_description", settings.seo_calendar_description || "");
        // SEO - Anime Detail
        formData.append("seo_anime_title", settings.seo_anime_title || "");
        formData.append("seo_anime_description", settings.seo_anime_description || "");
        // SEO - Watch
        formData.append("seo_watch_title", settings.seo_watch_title || "");
        formData.append("seo_watch_description", settings.seo_watch_description || "");

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
