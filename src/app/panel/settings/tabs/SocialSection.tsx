"use client";

import { Share2 } from "lucide-react";
import { FormField } from "@/shared/components/FormField";
import { XIcon, InstagramIcon, DiscordIcon, RedditIcon, TelegramIcon } from "@/shared/components/SocialIcons";

interface SocialSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

const socialFields = [
    { key: "social_x", label: "X (Twitter)", placeholder: "https://x.com/animemodu", icon: XIcon },
    { key: "social_instagram", label: "Instagram", placeholder: "https://instagram.com/animemodu", icon: InstagramIcon },
    { key: "social_telegram", label: "Telegram", placeholder: "https://t.me/animemodu", icon: TelegramIcon },
    { key: "social_discord", label: "Discord", placeholder: "https://discord.gg/animemodu", icon: DiscordIcon },
    { key: "social_reddit", label: "Reddit", placeholder: "https://reddit.com/r/animemodu", icon: RedditIcon },
];

export function SocialSection({ settings, onChange }: SocialSectionProps) {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h4 className="flex items-center gap-3 font-rubik text-lg font-bold text-text-heading">
                <div className="flex items-center justify-center w-8 h-8 bg-primary/10 text-primary border border-primary/20 rounded-lg">
                    <Share2 className="w-4 h-4" />
                </div>
                Sosyal Medya
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {socialFields.map((field) => (
                    <FormField
                        key={field.key}
                        id={field.key}
                        label={field.label}
                        icon={<field.icon className="w-5 h-5" />}
                    >
                        <input
                            id={field.key}
                            name={field.key}
                            value={settings[field.key] || ""}
                            onChange={(e) => onChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            autoComplete="off"
                            className={inputClassName}
                        />
                    </FormField>
                ))}
            </div>
        </div>
    );
}
