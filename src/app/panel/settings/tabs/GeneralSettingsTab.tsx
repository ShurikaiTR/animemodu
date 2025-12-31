"use client";

import { Input } from "@/shared/components/input";
import { Textarea } from "@/shared/components/textarea";
import { Label } from "@/shared/components/label";
import { ImageUpload } from "@/shared/components/ImageUpload";
import { Switch } from "@/shared/components/switch";
import { AlertTriangle, Users } from "lucide-react";

interface GeneralSettingsTabProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onLogoChange: (file: File | null) => void;
    onFaviconChange: (file: File | null) => void;
}

const socialFields = [
    { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/animemodu", icon: "𝕏" },
    { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/animemodu", icon: "📸" },
    { key: "social_telegram", label: "Telegram", placeholder: "https://t.me/animemodu", icon: "✈️" },
    { key: "social_discord", label: "Discord", placeholder: "https://discord.gg/animemodu", icon: "🎮" },
    { key: "social_reddit", label: "Reddit", placeholder: "https://reddit.com/r/animemodu", icon: "🤖" },
];

export default function GeneralSettingsTab({
    settings,
    onChange,
    onLogoChange,
    onFaviconChange,
}: GeneralSettingsTabProps) {
    return (
        <div className="space-y-8">
            {/* Site Bilgileri */}
            <div>
                <h3 className="text-lg font-semibold text-white mb-1">Site Bilgileri</h3>
                <p className="text-sm text-text-main/50">Sitenin temel bilgilerini düzenleyin.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl">
                <div className="space-y-6">
                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main/80">Site Adı</label>
                        <Input
                            id="site_name"
                            value={settings.site_name || ""}
                            onChange={(e) => onChange("site_name", e.target.value)}
                            placeholder="AnimeModu"
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                        />
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-text-main/80">Footer Tanıtım Metni</label>
                        <Textarea
                            id="site_footer_text"
                            value={settings.site_footer_text || ""}
                            onChange={(e) => onChange("site_footer_text", e.target.value)}
                            placeholder="Sitenin en altında görünecek kısa tanıtım yazısı..."
                            rows={4}
                            className="w-full rounded-xl bg-bg-secondary/30 border border-white/5 p-3 text-sm text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0 outline-none resize-none placeholder:text-text-main/30"
                        />
                    </div>
                </div>

                <div className="space-y-8">
                    <ImageUpload
                        label="Site Logosu"
                        description="Header bölümünde görünecek ana logo."
                        value={settings.site_logo}
                        onChange={onLogoChange}
                        aspectRatio="video"
                    />
                    <ImageUpload
                        label="Site Favicon"
                        description="Tarayıcı sekmesinde görünecek küçük ikon."
                        value={settings.site_favicon}
                        onChange={onFaviconChange}
                        aspectRatio="favicon"
                    />
                </div>
            </div>

            {/* Sosyal Medya */}
            <div className="pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-1">Sosyal Medya</h3>
                <p className="text-sm text-text-main/50 mb-6">Footer ve diğer yerlerde görünecek sosyal medya bağlantıları.</p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl">
                    {socialFields.map((field) => (
                        <div key={field.key} className="space-y-2">
                            <label className="flex items-center gap-2 text-sm font-medium text-text-main/80">
                                <span>{field.icon}</span>
                                {field.label}
                            </label>
                            <Input
                                id={field.key}
                                value={settings[field.key] || ""}
                                onChange={(e) => onChange(field.key, e.target.value)}
                                placeholder={field.placeholder}
                                autoComplete="off"
                                className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus:border-primary focus-visible:ring-0"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Özellik Toggle'ları */}
            <div className="pt-6 border-t border-white/5">
                <h3 className="text-lg font-semibold text-white mb-1">Özellikler</h3>
                <p className="text-sm text-text-main/50 mb-6">Site özelliklerini açıp kapatın.</p>

                <div className="space-y-4">
                    {/* Bakım Modu */}
                    <div className="flex items-center justify-between p-4 bg-bg-secondary/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-amber-500/10">
                                <AlertTriangle className="w-5 h-5 text-amber-500" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white block">Bakım Modu</label>
                                <p className="text-xs text-text-main/50">Aktif olduğunda ziyaretçiler bakım sayfasını görür.</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.maintenance_mode === "true"}
                            onCheckedChange={(checked) => onChange("maintenance_mode", checked ? "true" : "false")}
                        />
                    </div>

                    {/* Birlikte İzle */}
                    <div className="flex items-center justify-between p-4 bg-bg-secondary/20 rounded-xl border border-white/5">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center justify-center w-10 h-10 rounded-lg bg-primary/10">
                                <Users className="w-5 h-5 text-primary" />
                            </div>
                            <div>
                                <label className="text-sm font-medium text-white block">Birlikte İzle</label>
                                <p className="text-xs text-text-main/50">Kullanıcıların birlikte izleme özelliğini aktifleştirir.</p>
                            </div>
                        </div>
                        <Switch
                            checked={settings.watch_together === "true"}
                            onCheckedChange={(checked) => onChange("watch_together", checked ? "true" : "false")}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}
