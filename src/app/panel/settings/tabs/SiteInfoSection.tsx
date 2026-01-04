"use client";

import { FileText,Type } from "lucide-react";

import { FormField } from "@/shared/components/FormField";
import { ImageUpload } from "@/shared/components/ImageUpload";

interface SiteInfoSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onLogoChange: (file: File | null) => void;
    onFaviconChange: (file: File | null) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

const textareaClassName =
    "w-full pl-11 pr-4 py-4 text-sm font-medium leading-relaxed rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm resize-none";

export function SiteInfoSection({
    settings,
    onChange,
    onLogoChange,
    onFaviconChange,
}: SiteInfoSectionProps) {
    return (
        <div className="p-6 lg:p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Sol taraf - Metin alanları */}
                <div className="space-y-6">
                    <FormField id="site_name" label="Site Adı" icon={<Type className="w-5 h-5" />}>
                        <input
                            id="site_name"
                            name="site_name"
                            value={settings.site_name || ""}
                            onChange={(e) => onChange("site_name", e.target.value)}
                            placeholder="AnimeModu"
                            className={inputClassName}
                        />
                    </FormField>

                    <FormField
                        id="site_footer_text"
                        label="Footer Tanıtım Metni"
                        icon={<FileText className="w-5 h-5" />}
                        iconAlign="top"
                    >
                        <textarea
                            id="site_footer_text"
                            name="site_footer_text"
                            value={settings.site_footer_text || ""}
                            onChange={(e) => onChange("site_footer_text", e.target.value)}
                            placeholder="Sitenin en altında görünecek kısa tanıtım yazısı..."
                            rows={4}
                            className={textareaClassName}
                        />
                    </FormField>
                </div>

                {/* Sağ taraf - Görsel yüklemeleri */}
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
        </div>
    );
}
