"use client";

import { toast } from "sonner";

import { InstagramIcon, TelegramIcon, WhatsAppIcon,XIcon } from "@/shared/components/SocialIcons";
import { cn } from "@/shared/lib/utils";

interface ShareModalButtonsProps {
    shareUrl: string;
    shareText: string;
}

interface ShareButton {
    id: string;
    label: string;
    icon: React.ComponentType<{ size?: number; className?: string }>;
    hoverColor: string;
    onClick: () => void;
}

export default function ShareModalButtons({ shareUrl, shareText }: ShareModalButtonsProps) {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(shareText);

    const buttons: ShareButton[] = [
        {
            id: "whatsapp",
            label: "WhatsApp",
            icon: WhatsAppIcon,
            hoverColor: "hover:bg-whatsapp/20 hover:border-whatsapp hover:text-whatsapp",
            onClick: () => {
                window.open(`https://wa.me/?text=${encodedText}%20${encodedUrl}`, "_blank");
            }
        },
        {
            id: "x",
            label: "X",
            icon: XIcon,
            hoverColor: "hover:bg-primary/20 hover:border-primary hover:text-primary",
            onClick: () => {
                window.open(`https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedText}`, "_blank");
            }
        },
        {
            id: "telegram",
            label: "Telegram",
            icon: TelegramIcon,
            hoverColor: "hover:bg-telegram/20 hover:border-telegram hover:text-telegram",
            onClick: () => {
                window.open(`https://t.me/share/url?url=${encodedUrl}&text=${encodedText}`, "_blank");
            }
        },
        {
            id: "instagram",
            label: "Story",
            icon: InstagramIcon,
            hoverColor: "hover:bg-instagram/20 hover:border-instagram hover:text-instagram",
            onClick: () => {
                navigator.clipboard.writeText(shareUrl);
                toast.success("Link kopyalandı! Instagram Story'e yapıştırabilirsin.");
            }
        }
    ];

    return (
        <div className="space-y-3">
            <label className="text-xs font-semibold text-white/40 uppercase">
                Hızlı Paylaş
            </label>
            <div className="grid grid-cols-4 gap-3">
                {buttons.map((button) => (
                    <button
                        key={button.id}
                        onClick={button.onClick}
                        className={cn(
                            "flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200 cursor-pointer",
                            "bg-white/5 border-white/5 text-white/60",
                            button.hoverColor
                        )}
                    >
                        <button.icon size={24} />
                        <span className="text-xs font-semibold">{button.label}</span>
                    </button>
                ))}
            </div>
        </div>
    );
}
