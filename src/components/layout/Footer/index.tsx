import Link from "next/link";
import Image from "next/image";

import { getSiteInfo } from "@/actions/settings";

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
                        <div className="flex items-center gap-5">
                            <a href="#" className="w-5 h-5 fill-text-main hover:fill-primary transition-colors" aria-label="Instagram">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M12,2.16c3.2,0,3.58,0,4.85.07,3.25.15,4.77,1.69,4.92,4.92.06,1.27.07,1.65.07,4.85s0,3.58-.07,4.85c-.15,3.23-1.66,4.77-4.92,4.92-1.27.06-1.64.07-4.85.07s-3.58,0-4.85-.07c-3.26-.15-4.77-1.7-4.92-4.92-.06-1.27-.07-1.65-.07-4.85s0-3.58.07-4.85C2.38,3.92,3.9,2.38,7.15,2.23,8.42,2.18,8.8,2.16,12,2.16ZM12,0C8.74,0,8.33,0,7.05.07c-4.35.2-6.78,2.62-7,7C0,8.33,0,8.74,0,12s0,3.67.07,4.95c.2,4.36,2.62,6.78,7,7C8.33,24,8.74,24,12,24s3.67,0,4.95-.07c4.35-.2,6.78-2.62,7-7C24,15.67,24,15.26,24,12s0-3.67-.07-4.95c-.2-4.35-2.62-6.78-7-7C15.67,0,15.26,0,12,0Zm0,5.84A6.16,6.16,0,1,0,18.16,12,6.16,6.16,0,0,0,12,5.84ZM12,16a4,4,0,1,1,4-4A4,4,0,0,1,12,16ZM18.41,4.15a1.44,1.44,0,1,0,1.44,1.44A1.44,1.44,0,0,0,18.41,4.15Z" /></svg>
                            </a>
                            <a href="#" className="w-5 h-5 fill-text-main hover:fill-primary transition-colors" aria-label="Twitter">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M22,5.8a8.49,8.49,0,0,1-2.36.64,4.13,4.13,0,0,0,1.81-2.27,8.21,8.21,0,0,1-2.61,1,4.1,4.1,0,0,0-7,3.74A11.64,11.64,0,0,1,3.39,4.62a4.16,4.16,0,0,0-.55,2.07A4.09,4.09,0,0,0,4.67,10.1a4.05,4.05,0,0,1-1.87-.52v.05A4.1,4.1,0,0,0,6.09,13.7a4.12,4.12,0,0,1-1.85.07,4.1,4.1,0,0,0,3.83,2.85A8.23,8.23,0,0,1,3,18.34a11.63,11.63,0,0,0,6.29,1.85A11.59,11.59,0,0,0,21,8.45c0-.17,0-.35,0-.53A8.43,8.43,0,0,0,22,5.8Z" /></svg>
                            </a>
                            <a href="#" className="w-5 h-5 fill-text-main hover:fill-primary transition-colors" aria-label="LinkedIn">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" aria-hidden="true"><path d="M20.47,2H3.53A1.45,1.45,0,0,0,2.06,3.59V20.41A1.45,1.45,0,0,0,3.53,22H20.47a1.45,1.45,0,0,0,1.47-1.59V3.59A1.45,1.45,0,0,0,20.47,2ZM8.09,18.74h-3v-9h3ZM6.59,8.48h0a1.56,1.56,0,1,1,0-3.12,1.57,1.57,0,1,1,0,3.12ZM18.91,18.74h-3V13.91c0-1.21-.43-2-1.52-2A1.65,1.65,0,0,0,12.85,13a2,2,0,0,0-.1.73v5h-3s.05-8.14,0-9h3v1.29c.4-.62,1.11-1.5,2.71-1.5,2,0,3.45,1.3,3.45,4.06Z" /></svg>
                            </a>
                        </div>
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
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Terms of Use</Link></li>
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Privacy Policy</Link></li>
                            <li><Link href="#" className="text-sm text-text-main hover:text-primary transition-colors">Security</Link></li>
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
                        <Link href="#" className="text-xs text-text-main hover:text-primary transition-colors">Privacy policy</Link>
                        <Link href="#" className="text-xs text-text-main hover:text-primary transition-colors">Terms and conditions</Link>
                    </div>
                </div>
            </div>
        </footer>
    );
}
