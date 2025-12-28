"use client";

import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";

interface SocialMediaFieldsProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const SOCIAL_FIELDS = [
    { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/animemodu" },
    { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/animemodu" },
    { key: "social_telegram", label: "Telegram", placeholder: "https://t.me/animemodu" },
    { key: "social_discord", label: "Discord", placeholder: "https://discord.gg/animemodu" },
    { key: "social_reddit", label: "Reddit", placeholder: "https://reddit.com/r/animemodu" },
];

export default function SocialMediaFields({ settings, onChange }: SocialMediaFieldsProps) {
    return (
        <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white mb-4">Sosyal Medya</h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {SOCIAL_FIELDS.map((field) => (
                    <div key={field.key} className="space-y-2">
                        <Label htmlFor={field.key} className="text-sm font-medium text-text-main/80">
                            {field.label}
                        </Label>
                        <Input
                            id={field.key}
                            value={settings[field.key] || ""}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className="bg-bg-secondary/30 border-white/5 text-white focus:bg-bg-secondary/50 focus-visible:ring-0 h-11"
                        />
                    </div>
                ))}
            </div>
        </div>
    );
}
