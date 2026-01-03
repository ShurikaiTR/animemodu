"use client";

import { SiteInfoSection } from "./SiteInfoSection";
import { SocialSection } from "./SocialSection";
import { FeatureSection } from "./FeatureSection";

interface GeneralSettingsTabProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
    onLogoChange: (file: File | null) => void;
    onFaviconChange: (file: File | null) => void;
}

export default function GeneralSettingsTab({
    settings,
    onChange,
    onLogoChange,
    onFaviconChange,
}: GeneralSettingsTabProps) {
    return (
        <div className="divide-y divide-white/5">
            <SiteInfoSection
                settings={settings}
                onChange={onChange}
                onLogoChange={onLogoChange}
                onFaviconChange={onFaviconChange}
            />
            <SocialSection settings={settings} onChange={onChange} />
            <FeatureSection settings={settings} onChange={onChange} />
        </div>
    );
}
