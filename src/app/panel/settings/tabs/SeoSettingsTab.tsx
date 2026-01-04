"use client";

import { CalendarSeoSection,MoviesSeoSection } from "./SeoPageSections";
import {
    AnimesSeoSection,
    DiscoverSeoSection,
    GlobalSeoSection,
    HomeSeoSection,
} from "./SeoSections";
import { AnimeDetailSeoSection, WatchSeoSection } from "./SeoTemplateSections";

interface SeoSettingsTabProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onOgImageChange: (file: File | null) => void;
}

export default function SeoSettingsTab({ settings, onChange, onOgImageChange }: SeoSettingsTabProps) {
    return (
        <div className="divide-y divide-white/5">
            <GlobalSeoSection settings={settings} onOgImageChange={onOgImageChange} />
            <HomeSeoSection settings={settings} onChange={onChange} />
            <DiscoverSeoSection settings={settings} onChange={onChange} />
            <AnimesSeoSection settings={settings} onChange={onChange} />
            <MoviesSeoSection settings={settings} onChange={onChange} />
            <CalendarSeoSection settings={settings} onChange={onChange} />
            <AnimeDetailSeoSection settings={settings} onChange={onChange} />
            <WatchSeoSection settings={settings} onChange={onChange} />
        </div>
    );
}
