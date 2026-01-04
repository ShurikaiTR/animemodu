"use client";

import { Info, Play,Search } from "lucide-react";
import { useRef } from "react";

import { Label } from "@/shared/components/label";

import { SeoSection } from "./SeoComponents";

interface SeoSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

interface ClickableTagsProps {
    tags: string[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    settingKey: string;
    currentValue: string;
    onChange: (key: string, value: string) => void;
}

function ClickableTags({ tags, inputRef, settingKey, currentValue, onChange }: ClickableTagsProps) {
    const handleTagClick = (tag: string) => {
        const input = inputRef.current;
        if (!input) return;

        const start = input.selectionStart || currentValue.length;
        const end = input.selectionEnd || currentValue.length;

        const newValue = currentValue.slice(0, start) + tag + currentValue.slice(end);
        onChange(settingKey, newValue);

        setTimeout(() => {
            input.focus();
            const newPos = start + tag.length;
            input.setSelectionRange(newPos, newPos);
        }, 0);
    };

    return (
        <div className="flex flex-wrap gap-1.5">
            {tags.map(tag => (
                <button
                    key={tag}
                    type="button"
                    onClick={() => handleTagClick(tag)}
                    className="px-2 py-1 text-xs font-mono bg-primary/10 text-primary border border-primary/20 rounded-md hover:bg-primary/20 hover:border-primary/40 transition-all cursor-pointer"
                >
                    {tag}
                </button>
            ))}
        </div>
    );
}

interface TemplateFieldProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    value: string;
    onChange: (value: string) => void;
    placeholder: string;
    tags: string[];
    inputRef: React.RefObject<HTMLInputElement | null>;
    settingKey: string;
    onTagChange: (key: string, value: string) => void;
}

function TemplateField({ id, label, icon, value, onChange, placeholder, tags, inputRef, settingKey, onTagChange }: TemplateFieldProps) {
    return (
        <div className="space-y-2.5">
            <div className="flex items-center justify-between">
                <Label variant="panel" htmlFor={id}>{label}</Label>
            </div>
            <div className="relative group">
                <div className="absolute left-3.5 inset-y-0 flex items-center pointer-events-none transition-colors group-focus-within:text-primary text-text-main/30">
                    {icon}
                </div>
                <input
                    ref={inputRef}
                    id={id}
                    name={id}
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className={inputClassName}
                />
            </div>
            <ClickableTags
                tags={tags}
                inputRef={inputRef}
                settingKey={settingKey}
                currentValue={value}
                onChange={onTagChange}
            />
        </div>
    );
}

export function AnimeDetailSeoSection({ settings, onChange }: SeoSectionProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const animeTags = ["{anime_title}", "{year}", "{genres}"];
    const animeDescTags = ["{anime_title}", "{overview}", "{genres}", "{year}"];

    return (
        <SeoSection title="Anime Detay (Şablon)" icon={<Info className="w-4 h-4" />}>
            <TemplateField
                id="seo_anime_title"
                label="Başlık Şablonu"
                icon={<Info className="w-5 h-5" />}
                value={settings.seo_anime_title || ""}
                onChange={(value) => onChange("seo_anime_title", value)}
                placeholder="{anime_title} İzle"
                tags={animeTags}
                inputRef={titleRef}
                settingKey="seo_anime_title"
                onTagChange={onChange}
            />
            <TemplateField
                id="seo_anime_description"
                label="Açıklama Şablonu"
                icon={<Search className="w-5 h-5" />}
                value={settings.seo_anime_description || ""}
                onChange={(value) => onChange("seo_anime_description", value)}
                placeholder="{anime_title} - {overview}"
                tags={animeDescTags}
                inputRef={descRef}
                settingKey="seo_anime_description"
                onTagChange={onChange}
            />
        </SeoSection>
    );
}

export function WatchSeoSection({ settings, onChange }: SeoSectionProps) {
    const titleRef = useRef<HTMLInputElement>(null);
    const descRef = useRef<HTMLInputElement>(null);

    const watchTags = ["{anime_title}", "{episode}", "{year}", "{genres}"];
    const watchDescTags = ["{anime_title}", "{episode}", "{year}", "{genres}", "{overview}"];

    return (
        <SeoSection title="İzle Sayfası (Şablon)" icon={<Play className="w-4 h-4" />}>
            <TemplateField
                id="seo_watch_title"
                label="Başlık Şablonu"
                icon={<Play className="w-5 h-5" />}
                value={settings.seo_watch_title || ""}
                onChange={(value) => onChange("seo_watch_title", value)}
                placeholder="{anime_title} {episode} İzle"
                tags={watchTags}
                inputRef={titleRef}
                settingKey="seo_watch_title"
                onTagChange={onChange}
            />
            <TemplateField
                id="seo_watch_description"
                label="Açıklama Şablonu"
                icon={<Search className="w-5 h-5" />}
                value={settings.seo_watch_description || ""}
                onChange={(value) => onChange("seo_watch_description", value)}
                placeholder="{anime_title} {episode} Türkçe altyazılı izle."
                tags={watchDescTags}
                inputRef={descRef}
                settingKey="seo_watch_description"
                onTagChange={onChange}
            />
        </SeoSection>
    );
}
