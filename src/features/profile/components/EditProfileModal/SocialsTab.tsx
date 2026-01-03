"use client";

import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import type { ProfileRow } from "@/shared/types/helpers";
import { XIcon, InstagramIcon, DiscordIcon, RedditIcon, TelegramIcon } from "@/shared/components/SocialIcons";

interface SocialsTabProps {
    user: ProfileRow & { socials?: { x?: string; instagram?: string; discord?: string; reddit?: string; telegram?: string } };
}

export default function SocialsTab({ user }: SocialsTabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-text-main/50">X</Label>
                <div className="relative group focus-within:text-white transition-colors">
                    <XIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-white transition-colors" />
                    <Input name="social_x" defaultValue={user.socials?.x} variant="modal" className="pl-10 focus:border-white/50" placeholder="animemodu" autoComplete="off" />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Instagram</Label>
                <div className="relative group focus-within:text-instagram transition-colors">
                    <InstagramIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-instagram transition-colors" />
                    <Input name="social_instagram" defaultValue={user.socials?.instagram} variant="modal" className="pl-10 focus:border-instagram/50" placeholder="animemodu" />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Discord</Label>
                <div className="relative group focus-within:text-discord transition-colors">
                    <DiscordIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-discord transition-colors" />
                    <Input name="social_discord" defaultValue={user.socials?.discord} variant="modal" className="pl-10 focus:border-discord/50" placeholder="kullaniciadi" />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Reddit</Label>
                <div className="relative group focus-within:text-reddit transition-colors">
                    <RedditIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-reddit transition-colors" />
                    <Input name="social_reddit" defaultValue={user.socials?.reddit} variant="modal" className="pl-10 focus:border-reddit/50" placeholder="kullaniciadi" />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Telegram</Label>
                <div className="relative group focus-within:text-telegram transition-colors">
                    <TelegramIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-telegram transition-colors" />
                    <Input name="social_telegram" defaultValue={user.socials?.telegram} variant="modal" className="pl-10 focus:border-telegram/50" placeholder="kullaniciadi" />
                </div>
            </div>
        </div>
    );
}
