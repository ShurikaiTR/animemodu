"use client";

import { MoreHorizontal } from "lucide-react";
import Link from "next/link";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";

interface MoreDropdownProps {
    discordUrl?: string;
}
const menuItems = [
    { href: "/takvim", label: "Takvim" },
    { href: "/api/random", label: "Rastgele Anime", prefetch: false },
    { href: "/sss", label: "SSS" },
    { href: "/iletisim", label: "İletişim" },
];

export default function MoreDropdown({ discordUrl }: MoreDropdownProps) {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <span className="text-sm font-medium text-text-main hover:text-primary transition-colors block cursor-pointer leading-5">
                    <MoreHorizontal className="w-5 h-5 inline-block align-middle" />
                </span>
            </DropdownMenuTrigger>
            <DropdownMenuContent
                align="start"
                sideOffset={22}
                className="w-48 max-h-72 overflow-y-scroll custom-scrollbar bg-bg-secondary border-none text-white p-1.5 shadow-2xl rounded-2xl animate-in fade-in slide-in-from-top-2 duration-300"
            >
                {menuItems.map((item) => (
                    <DropdownMenuItem key={item.href} asChild className="focus:text-primary cursor-pointer px-4 py-2.5 transition-colors outline-none focus:bg-transparent">
                        <Link href={item.href} prefetch={item.prefetch !== false}>
                            <span className="font-medium text-sm">{item.label}</span>
                        </Link>
                    </DropdownMenuItem>
                ))}

                {discordUrl && (
                    <DropdownMenuItem asChild className="focus:text-discord cursor-pointer px-4 py-2.5 transition-colors outline-none focus:bg-transparent">
                        <a href={discordUrl} target="_blank" rel="noopener noreferrer">
                            <span className="font-medium text-sm">Discord</span>
                        </a>
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
