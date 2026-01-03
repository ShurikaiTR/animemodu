import type { SocialMediaLinks } from "@/shared/types/helpers";
import { XIcon, InstagramIcon, DiscordIcon, RedditIcon, TelegramIcon } from "@/shared/components/SocialIcons";

// URL builder functions for social platforms
const buildSocialUrl = (platform: string, username: string): string => {
    const urls: Record<string, string> = {
        x: `https://x.com/${username}`,
        instagram: `https://instagram.com/${username}`,
        discord: `https://discord.com/users/${username}`,
        reddit: `https://reddit.com/user/${username}`,
        telegram: `https://t.me/${username}`,
    };
    return urls[platform] || "#";
};

interface ProfileSocialsProps {
    socials?: SocialMediaLinks;
}

export default function ProfileSocials({ socials }: ProfileSocialsProps) {
    if (!socials) return null;

    const hasAnySocial = socials.x || socials.instagram || socials.discord || socials.reddit || socials.telegram;
    if (!hasAnySocial) return null;

    return (
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
            {socials.x && (
                <a
                    href={buildSocialUrl("x", socials.x)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                >
                    <XIcon className="w-4 h-4" />
                </a>
            )}
            {socials.instagram && (
                <a
                    href={buildSocialUrl("instagram", socials.instagram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-instagram"
                >
                    <InstagramIcon className="w-4 h-4" />
                </a>
            )}
            {socials.discord && (
                <a
                    href={buildSocialUrl("discord", socials.discord)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-discord"
                >
                    <DiscordIcon className="w-4 h-4" />
                </a>
            )}
            {socials.reddit && (
                <a
                    href={buildSocialUrl("reddit", socials.reddit)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-reddit"
                >
                    <RedditIcon className="w-4 h-4" />
                </a>
            )}
            {socials.telegram && (
                <a
                    href={buildSocialUrl("telegram", socials.telegram)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-telegram"
                >
                    <TelegramIcon className="w-4 h-4" />
                </a>
            )}
        </div>
    );
}
