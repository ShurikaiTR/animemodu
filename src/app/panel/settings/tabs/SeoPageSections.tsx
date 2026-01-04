"use client";

import { Calendar,Film, Search } from "lucide-react";

import { FormField } from "@/shared/components/FormField";

import { SeoSection } from "./SeoComponents";

interface SeoSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

export function MoviesSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Filmler Sayfası" icon={<Film className="w-4 h-4" />}>
            <FormField id="seo_movies_title" label="Başlık" icon={<Film className="w-5 h-5" />}>
                <input
                    id="seo_movies_title"
                    name="seo_movies_title"
                    value={settings.seo_movies_title || ""}
                    onChange={(e) => onChange("seo_movies_title", e.target.value)}
                    placeholder="Anime Filmleri - AnimeModu"
                    className={inputClassName}
                />
            </FormField>
            <FormField id="seo_movies_description" label="Açıklama" icon={<Search className="w-5 h-5" />}>
                <input
                    id="seo_movies_description"
                    name="seo_movies_description"
                    value={settings.seo_movies_description || ""}
                    onChange={(e) => onChange("seo_movies_description", e.target.value)}
                    placeholder="En iyi anime filmlerini izleyin..."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}

export function CalendarSeoSection({ settings, onChange }: SeoSectionProps) {
    return (
        <SeoSection title="Takvim Sayfası" icon={<Calendar className="w-4 h-4" />}>
            <FormField id="seo_calendar_title" label="Başlık" icon={<Calendar className="w-5 h-5" />}>
                <input
                    id="seo_calendar_title"
                    name="seo_calendar_title"
                    value={settings.seo_calendar_title || ""}
                    onChange={(e) => onChange("seo_calendar_title", e.target.value)}
                    placeholder="Yayın Takvimi - Haftalık Anime Programı"
                    className={inputClassName}
                />
            </FormField>
            <FormField id="seo_calendar_description" label="Açıklama" icon={<Search className="w-5 h-5" />}>
                <input
                    id="seo_calendar_description"
                    name="seo_calendar_description"
                    value={settings.seo_calendar_description || ""}
                    onChange={(e) => onChange("seo_calendar_description", e.target.value)}
                    placeholder="Anime yayın takvimini takip edin..."
                    className={inputClassName}
                />
            </FormField>
        </SeoSection>
    );
}
