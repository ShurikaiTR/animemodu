"use client";

import { Share2 } from "lucide-react";
import { FormField } from "@/shared/components/FormField";
import { XIcon, InstagramIcon, DiscordIcon, RedditIcon, TelegramIcon } from "@/shared/components/SocialIcons";
import { extractUsername, SocialPlatform } from "@/shared/lib/socials";

interface SocialSectionProps {
    settings: Record<string, string>;
    onChange: (key: string, value: string) => void;
}

const inputClassName =
    "w-full h-12 pl-11 pr-4 py-2 text-sm font-medium rounded-xl border border-white/5 bg-white/[0.03] text-white placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 outline-none transition-all shadow-sm";

const socialFields: { key: string; label: string; placeholder: string; icon: any; platform: SocialPlatform }[] = [
    { key: "social_x", label: "X (Twitter)", placeholder: "animemodu", icon: XIcon, platform: "x" },
    { key: "social_instagram", label: "Instagram", placeholder: "animemodu", icon: InstagramIcon, platform: "instagram" },
    { key: "social_telegram", label: "Telegram", placeholder: "animemodu", icon: TelegramIcon, platform: "telegram" },
    { key: "social_discord", label: "Discord", placeholder: "animemodu", icon: DiscordIcon, platform: "discord" },
    { key: "social_reddit", label: "Reddit", placeholder: "animemodu", icon: RedditIcon, platform: "reddit" },
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
                            onChange={(e) => {
                                const value = e.target.value;
                                const username = extractUsername(field.platform, value);
                                onChange(field.key, username);
                            }}
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
