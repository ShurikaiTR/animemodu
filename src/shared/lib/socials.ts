/**
 * Sosyal medya platformları için URL oluşturma ve kullanıcı adı ayıklama yardımcıları.
 */

export const SOCIAL_PLATFORMS = {
    x: {
        name: "X (Twitter)",
        baseUrl: "https://x.com/",
        placeholder: "kullaniciadi",
    },
    instagram: {
        name: "Instagram",
        baseUrl: "https://instagram.com/",
        placeholder: "kullaniciadi",
    },
    telegram: {
        name: "Telegram",
        baseUrl: "https://t.me/",
        placeholder: "kullaniciadi",
    },
    discord: {
        name: "Discord",
        baseUrl: "https://discord.com/users/", // Not: Discord genelde davet linki veya ID olur ama kullanıcı adı talebi var
        placeholder: "kullaniciadi",
    },
    reddit: {
        name: "Reddit",
        baseUrl: "https://reddit.com/user/",
        placeholder: "kullaniciadi",
    },
} as const;

export type SocialPlatform = keyof typeof SOCIAL_PLATFORMS;

/**
 * Kullanıcı adından tam URL oluşturur.
 */
export function buildSocialUrl(platform: SocialPlatform, username: string): string {
    if (!username) return "#";
    if (username.startsWith("http")) return username; // Zaten URL ise dokunma

    // Temizlik: @ işaretini kaldır
    const cleanUsername = username.startsWith("@") ? username.substring(1) : username;

    const config = SOCIAL_PLATFORMS[platform];
    if (!config) return "#";

    return `${config.baseUrl}${cleanUsername}`;
}

/**
 * URL'den kullanıcı adını ayıklar (Kullanıcı panelde URL yapıştırırsa diye).
 */
export function extractUsername(platform: SocialPlatform, value: string): string {
    if (!value) return "";
    if (!value.startsWith("http")) return value; // URL değilse aynen dön

    const config = SOCIAL_PLATFORMS[platform];
    if (!config) return value;

    try {
        const url = new URL(value);
        // Pathname genelde /username olur
        return url.pathname.replace(/^\/|\/$/g, "");
    } catch {
        return value;
    }
}
