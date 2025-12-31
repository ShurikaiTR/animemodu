"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { cn } from "@/shared/lib/utils";
import { LayoutDashboard, Film, FileText, Users, MessageSquare, ArrowLeft, LogOut, Settings, Flag, Tags, Tv, Layers } from "lucide-react";
import { Button } from "@/shared/components/button";
import { useAdmin } from "./AdminContext";
import { SidebarMenu } from "./SidebarMenu";

import type { LucideIcon } from "lucide-react";

type MenuItem = {
    title: string;
    icon?: LucideIcon;
    href?: string;
    items?: { title: string; href: string; icon?: LucideIcon }[];
    isHeader?: boolean;
};

const MENU_ITEMS: MenuItem[] = [
    { title: "Gösterge Paneli", icon: LayoutDashboard, href: "/panel" },

    { title: "İçerik Yönetimi", isHeader: true },
    {
        title: "Animeler",
        icon: Tv,
        items: [
            { title: "Anime Listesi", href: "/panel/series", icon: Tv },
            { title: "Bölümler", href: "/panel/episodes", icon: Layers },
        ]
    },
    { title: "Filmler", icon: Film, href: "/panel/movies" },
    { title: "Türler", icon: Tags, href: "/panel/genres" },

    { title: "Topluluk", isHeader: true },
    { title: "Kullanıcılar", icon: Users, href: "/panel/users" },
    { title: "Yorumlar", icon: MessageSquare, href: "/panel/comments" },
    { title: "Bildirimler", icon: Flag, href: "/panel/reports" },

    { title: "Site Yönetimi", isHeader: true },
    { title: "Sayfalar", icon: FileText, href: "/panel/pages" },
    { title: "Ayarlar", icon: Settings, href: "/panel/settings" },
    { title: "Siteye Dön", icon: ArrowLeft, href: "/" },
];

export default function AdminSidebar() {
    const { isSidebarOpen, closeSidebar } = useAdmin();
    const [expandedMenu, setExpandedMenu] = useState<string | null>(null);

    return (
        <>
            <div
                className={cn(
                    "fixed inset-0 z-[100] bg-black/50 transition-opacity duration-300 lg:hidden",
                    isSidebarOpen ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"
                )}
                onClick={closeSidebar}
            />

            <aside
                className={cn(
                    "sticky top-0 left-0 z-[101] w-72 h-fit bg-bg-main border-r border-primary/10 flex flex-col shrink-0 transition-transform duration-300 lg:translate-x-0",
                    "hidden lg:flex",
                    isSidebarOpen ? "!flex fixed inset-0 h-screen" : ""
                )}
            >
                <div className="h-20 flex-none flex items-center px-8 bg-bg-main">
                    <Link href="/panel" className="block">
                        <Image
                            src="/img/animemodu-logo.svg"
                            alt="AnimeModu"
                            width={0}
                            height={0}
                            sizes="100vw"
                            className="w-auto h-9"
                            style={{ width: "auto", height: "auto" }}
                            loading="eager"
                            priority
                        />
                    </Link>
                </div>

                <div className="flex-none px-4 pb-4">
                    <div className="bg-bg-secondary/40 border border-white/5 rounded-2xl p-3 flex items-center gap-3 backdrop-blur-sm">
                        <div className="w-10 h-10 rounded-xl overflow-hidden border border-white/10 shrink-0">
                            <Image src="/img/auth/gojo.png" alt="Admin" width={40} height={40} className="object-cover" />
                        </div>
                        <div className="flex-1 min-w-0">
                            <span className="block text-[10px] uppercase tracking-[0.1em] text-text-main/40 font-bold leading-tight mb-0.5">Admin</span>
                            <p className="block text-sm font-semibold text-white truncate">Gojo Satoru</p>
                        </div>
                        <Button variant="ghost" size="icon" className="w-8 h-8 rounded-lg text-text-main/40 hover:text-danger hover:bg-danger/10 transition-colors">
                            <LogOut className="w-4 h-4 !relative !z-auto" />
                        </Button>
                    </div>
                </div>

                <nav className="py-6">
                    <SidebarMenu items={MENU_ITEMS} expandedMenu={expandedMenu} setExpandedMenu={setExpandedMenu} />
                </nav>

                <div className="flex-none p-8 border-t border-primary/10">
                    <p className="text-xs text-text-main/70 leading-5">
                        © AnimeModu, 2024. <br /> Created by <a href="#" className="text-white hover:text-primary">Dev Team</a>
                    </p>
                </div>
            </aside>
        </>
    );
}
