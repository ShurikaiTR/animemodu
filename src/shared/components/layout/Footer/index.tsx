import Link from "next/link";
import Image from "next/image";

import { getSiteInfo } from "@/features/settings/actions";
import { XIcon, InstagramIcon, DiscordIcon, RedditIcon, TelegramIcon } from "@/shared/components/SocialIcons";

export default async function Footer() {
    const siteInfo = await getSiteInfo();

    return (
        <footer className="bg-bg-main pt-20 pb-12 border-t border-bg-secondary mt-auto">
            <div className="container mx-auto px-4 sm:px-8">
                <div className="flex flex-wrap -mx-4">
                    <div className="w-full sm:w-1/2 lg:w-4/12 px-4 mb-8 lg:mb-0">
                        <Link href="/" className="relative block w-36 h-10 mb-5">
                            <Image
                                src={siteInfo.site_logo}
                                alt={siteInfo.site_name}
                                fill
                                className="object-contain"
                                priority
                            />
                        </Link>
                        <p className="text-sm leading-6 text-text-main mb-5 whitespace-pre-line">
                            {siteInfo.site_footer_text}
                        </p>
                        {/* Sosyal Medya - Sadece dolu olanlar gösterilir */}
                        {(siteInfo.social_x || siteInfo.social_instagram || siteInfo.social_discord || siteInfo.social_reddit || siteInfo.social_telegram) && (
                            <div className="flex items-center gap-4">
                                {siteInfo.social_x && (
                                    <a href={siteInfo.social_x} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-primary transition-colors" aria-label="X (Twitter)">
                                        <XIcon size={20} />
                                    </a>
                                )}
                                {siteInfo.social_instagram && (
                                    <a href={siteInfo.social_instagram} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-primary transition-colors" aria-label="Instagram">
                                        <InstagramIcon size={20} />
                                    </a>
                                )}
                                {siteInfo.social_discord && (
                                    <a href={siteInfo.social_discord} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-primary transition-colors" aria-label="Discord">
                                        <DiscordIcon size={20} />
                                    </a>
                                )}
                                {siteInfo.social_reddit && (
                                    <a href={siteInfo.social_reddit} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-primary transition-colors" aria-label="Reddit">
                                        <RedditIcon size={20} />
                                    </a>
                                )}
                                {siteInfo.social_telegram && (
                                    <a href={siteInfo.social_telegram} target="_blank" rel="noopener noreferrer" className="text-text-main hover:text-primary transition-colors" aria-label="Telegram">
                                        <TelegramIcon size={20} />
                                    </a>
                                )}
                            </div>
                        )}
                    </div>

                    <div className="w-1/2 sm:w-1/3 lg:w-2/12 px-4 mb-8 lg:mb-0">
                        <h6 className="text-white text-base font-medium mb-5">Resources</h6>
                        <ul className="flex flex-col gap-2.5">
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">About Us</Link></li>
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Pricing Plans</Link></li>
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Help Center</Link></li>
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Contacts</Link></li>
                        </ul>
                    </div>

                    <div className="w-1/2 sm:w-1/3 lg:w-2/12 px-4 mb-8 lg:mb-0">
                        <h6 className="text-white text-base font-medium mb-5">Legal</h6>
                        <ul className="flex flex-col gap-2.5">
                            <li><Link href="/kullanim-kosullari" className="text-sm text-text-main hover:text-primary transition-colors">Kullanım Koşulları</Link></li>
                            <li><Link href="/gizlilik" className="text-sm text-text-main hover:text-primary transition-colors">Gizlilik Politikası</Link></li>
                            <li><Link href="/cerez-politikasi" className="text-sm text-text-main hover:text-primary transition-colors">Çerezler</Link></li>
                        </ul>
                    </div>

                    <div className="w-full sm:w-1/3 lg:w-4/12 px-4">
                        <h6 className="text-white text-base font-medium mb-5">Contact</h6>
                        <p className="text-sm leading-6 text-text-main mb-2.5">
                            <a href="tel:+18002345678" className="hover:text-primary transition-colors">+1 (800) 234-5678</a>
                        </p>
                        <p className="text-sm leading-6 text-text-main">
                            <a href="mailto:support@moviego.com" className="hover:text-primary transition-colors">support@moviego.com</a>
                        </p>
                    </div>
                </div>

                <div className="border-t border-bg-secondary mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <span className="text-xs text-text-main">© FlixTV, 2021. Created by <a href="https://themeforest.net/user/dmitryvolkov/portfolio" className="text-white hover:text-primary transition-colors" target="_blank" rel="noopener noreferrer">Dmitry Volkov</a>.</span>
                    <div className="flex gap-4">
                        <Link href="/gizlilik" className="text-xs text-text-main hover:text-primary transition-colors">Gizlilik Politikası</Link>
                        <Link href="/kullanim-kosullari" className="text-xs text-text-main hover:text-primary transition-colors">Kullanım Koşulları</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
