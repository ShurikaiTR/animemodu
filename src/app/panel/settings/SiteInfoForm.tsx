"use client";

import { useState, useTransition } from "react";
import { Input } from "@/shared/components/input";
import { Button } from "@/shared/components/button";
import { Textarea } from "@/shared/components/textarea";
import { Label } from "@/shared/components/label";
import { ImageUpload } from "@/shared/components/ImageUpload";
import { updateSiteInfo } from "@/features/settings/actions";
import { toast } from "sonner";
import { Save } from "lucide-react";
import FeatureToggles from "./FeatureToggles";
import SocialMediaFields from "./SocialMediaFields";

interface SiteInfoFormProps {
    initialSettings: Record<string, string>;
}

export default function SiteInfoForm({ initialSettings }: SiteInfoFormProps) {
    const [isPending, startTransition] = useTransition();
    const [settings, setSettings] = useState(initialSettings);
    const [logoFile, setLogoFile] = useState<File | null>(null);
    const [faviconFile, setFaviconFile] = useState<File | null>(null);

    const handleChange = (key: string, value: string) => {
        setSettings((prev) => ({ ...prev, [key]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        const formData = new FormData();
        // General settings
        formData.append("site_name", settings.site_name || "");
        formData.append("site_footer_text", settings.site_footer_text || "");
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

        startTransition(async () => {
            const result = await updateSiteInfo(formData);

            if (result.success) {
                toast.success("Site bilgileri güncellendi! ✨");
                setLogoFile(null);
                setFaviconFile(null);
            } else {
                toast.error(result.error || "Güncelleme başarısız oldu.");
            }
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 pb-20">
            {/* General Settings */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <Label htmlFor="site_name" className="text-sm font-medium text-text-main/80">Site Adı</Label>
                        <Input
                            id="site_name"
                            value={settings.site_name || ""}
                            onChange={(e) => handleChange("site_name", e.target.value)}
                            placeholder="AnimeModu"
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 h-12"
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="site_footer_text" className="text-sm font-medium text-text-main/80">Footer Tanıtım Metni</Label>
                        <Textarea
                            id="site_footer_text"
                            value={settings.site_footer_text || ""}
                            onChange={(e) => handleChange("site_footer_text", e.target.value)}
                            placeholder="Sitenin en altında görünecek kısa tanıtım yazısı..."
                            rows={4}
                            className="w-full rounded-xl bg-bg-secondary/30 border border-white/5 p-3 text-sm text-white focus:bg-bg-secondary/50 focus-visible:ring-0 outline-none resize-none placeholder:text-text-main/30"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <ImageUpload
                        label="Site Logosu"
                        description="Header bölümünde görünecek ana logo."
                        value={settings.site_logo}
                        onChange={setLogoFile}
                        aspectRatio="video"
                    />
                    <ImageUpload
                        label="Site Favicon"
                        description="Tarayıcı sekmesinde görünecek küçük ikon."
                        value={settings.site_favicon}
                        onChange={setFaviconFile}
                        aspectRatio="favicon"
                    />
                </div>
            </div>

            {/* Feature Toggles */}
            <div className="pt-6 border-t border-white/5">
                <FeatureToggles settings={settings} onChange={handleChange} />
            </div>

            {/* Social Media */}
            <div className="pt-6 border-t border-white/5">
                <SocialMediaFields settings={settings} onChange={handleChange} />
            </div>

            {/* Submit Button */}
            <div className="pt-8 border-t border-white/5 flex justify-end">
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
