import { Twitter, Instagram, Github, Globe } from "lucide-react";
import type { SocialMediaLinks } from "@/shared/types/helpers";

interface ProfileSocialsProps {
    socials?: SocialMediaLinks;
}

export default function ProfileSocials({ socials }: ProfileSocialsProps) {
    // Eğer hiç sosyal medya bağlantısı yoksa bileşeni render etme
    if (!socials) return null;

    const hasAnySocial = socials.twitter || socials.instagram || socials.github || socials.website;
    if (!hasAnySocial) return null;

    return (
        <div className="flex items-center gap-1 bg-white/[0.03] border border-white/[0.05] p-1 rounded-xl">
            {socials.twitter && (
                <a
                    href={socials.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-[#1DA1F2]"
                >
                    <Twitter className="w-4 h-4" />
                </a>
            )}
            {socials.instagram && (
                <a
                    href={socials.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-[#E4405F]"
                >
                    <Instagram className="w-4 h-4" />
                </a>
            )}
            {socials.github && (
                <a
                    href={socials.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-white"
                >
                    <Github className="w-4 h-4" />
                </a>
            )}
            {socials.website && (
                <a
                    href={socials.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 sm:w-9 sm:h-9 flex items-center justify-center rounded-lg hover:bg-white/5 transition-colors text-white/40 hover:text-primary"
                >
                    <Globe className="w-4 h-4" />
                </a>
            )}
        </div>
    );
}
