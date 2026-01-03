"use client";

import { Search, Home, Compass, Tv } from "lucide-react";
import { SeoSection } from "./SeoComponents";
import { FormField } from "@/shared/components/FormField";
import { ImageUpload } from "@/shared/components/ImageUpload";

interface SeoSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

interface GlobalSeoSectionProps {
    settings: Record<string, string>;
    onOgImageChange: (file: File | null) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

export function GlobalSeoSection({ settings, onOgImageChange }: GlobalSeoSectionProps) {
    return (
        <div className="p-6 lg:p-8">
            <ImageUpload
                label="OG Görsel"
                description="Sosyal medya paylaşımlarında görünür (1200x630)."
                value={settings.seo_og_image}
                onChange={onOgImageChange}
                aspectRatio="video"
            />
        </div>
    );
}

export function HomeSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Ana Sayfa" icon={<Home className="w-4 h-4" />}>
            <FormField id="seo_home_title" label="Başlık" icon={<Home className="w-5 h-5" />}>
                <input
                    id="seo_home_title"
                    name="seo_home_title"
                    value={settings.seo_home_title || ""}
                    onChange={(e) => onChange("seo_home_title", e.target.value)}
                    placeholder="AnimeModu - Türkçe Altyazılı Anime İzle"
                    className={inputClassName}
                />
            </FormField>
            <FormField id="seo_home_description" label="Açıklama" icon={<Search className="w-5 h-5" />}>
                <input
                    id="seo_home_description"
                    name="seo_home_description"
                    value={settings.seo_home_description || ""}
                    onChange={(e) => onChange("seo_home_description", e.target.value)}
                    placeholder="En yeni animeleri Türkçe altyazılı izleyin..."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}

export function DiscoverSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Keşfet Sayfası" icon={<Compass className="w-4 h-4" />}>
            <FormField id="seo_discover_title" label="Başlık" icon={<Compass className="w-5 h-5" />}>
                <input
                    id="seo_discover_title"
                    name="seo_discover_title"
                    value={settings.seo_discover_title || ""}
                    onChange={(e) => onChange("seo_discover_title", e.target.value)}
                    placeholder="Anime Keşfet - Tüm Animeler"
                    className={inputClassName}
                />
            </FormField>
            <FormField id="seo_discover_description" label="Açıklama" icon={<Search className="w-5 h-5" />}>
                <input
                    id="seo_discover_description"
                    name="seo_discover_description"
                    value={settings.seo_discover_description || ""}
                    onChange={(e) => onChange("seo_discover_description", e.target.value)}
                    placeholder="Binlerce anime arasından arama yapın..."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}

export function AnimesSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Animeler Sayfası" icon={<Tv className="w-4 h-4" />}>
            <FormField id="seo_animes_title" label="Başlık" icon={<Tv className="w-5 h-5" />}>
                <input
                    id="seo_animes_title"
                    name="seo_animes_title"
                    value={settings.seo_animes_title || ""}
                    onChange={(e) => onChange("seo_animes_title", e.target.value)}
                    placeholder="Anime Serileri - AnimeModu"
                    className={inputClassName}
                />
            </FormField>
            <FormField id="seo_animes_description" label="Açıklama" icon={<Search className="w-5 h-5" />}>
                <input
                    id="seo_animes_description"
                    name="seo_animes_description"
                    value={settings.seo_animes_description || ""}
                    onChange={(e) => onChange("seo_animes_description", e.target.value)}
                    placeholder="En popüler anime serilerini keşfedin..."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}
