"use client";

import { Search, Info, Play } from "lucide-react";
import { SeoSection } from "./SeoComponents";
import { FormField } from "@/shared/components/FormField";

interface SeoSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

export function AnimeDetailSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Anime Detay (Şablon)" icon={<Info className="w-4 h-4" />}>
            <FormField
                id="seo_anime_title"
                label="Başlık Şablonu"
                icon={<Info className="w-5 h-5" />}
                helperText="{anime_title}, {year}, {genres}"
            >
                <input
                    id="seo_anime_title"
                    name="seo_anime_title"
                    value={settings.seo_anime_title || ""}
                    onChange={(e) => onChange("seo_anime_title", e.target.value)}
                    placeholder="{anime_title} İzle"
                    className={inputClassName}
                />
            </FormField>
            <FormField
                id="seo_anime_description"
                label="Açıklama Şablonu"
                icon={<Search className="w-5 h-5" />}
                helperText="{anime_title}, {overview}, {genres}"
            >
                <input
                    id="seo_anime_description"
                    name="seo_anime_description"
                    value={settings.seo_anime_description || ""}
                    onChange={(e) => onChange("seo_anime_description", e.target.value)}
                    placeholder="{anime_title} - {overview}"
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}

export function WatchSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="İzle Sayfası (Şablon)" icon={<Play className="w-4 h-4" />}>
            <FormField
                id="seo_watch_title"
                label="Başlık Şablonu"
                icon={<Play className="w-5 h-5" />}
                helperText="{anime_title}, {episode}, {season}"
            >
                <input
                    id="seo_watch_title"
                    name="seo_watch_title"
                    value={settings.seo_watch_title || ""}
                    onChange={(e) => onChange("seo_watch_title", e.target.value)}
                    placeholder="{anime_title} {episode} İzle"
                    className={inputClassName}
                />
            </FormField>
            <FormField
                id="seo_watch_description"
                label="Açıklama Şablonu"
                icon={<Search className="w-5 h-5" />}
                helperText="{anime_title}, {episode}, {season}"
            >
                <input
                    id="seo_watch_description"
                    name="seo_watch_description"
                    value={settings.seo_watch_description || ""}
                    onChange={(e) => onChange("seo_watch_description", e.target.value)}
                    placeholder="{anime_title} {episode} Türkçe altyazılı izle."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}
