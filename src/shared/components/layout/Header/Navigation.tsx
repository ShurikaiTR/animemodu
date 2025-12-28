"use client";

import Link from "next/link";
import { cn } from "@/shared/lib/utils";

interface NavigationProps {
    isMobileMenuOpen: boolean;
}

export default function Navigation({ isMobileMenuOpen }: NavigationProps) {
    return (
        <ul className={cn(
            "fixed left-0 w-full bg-bg-main border-b border-bg-secondary z-[100] transition-all duration-500 flex flex-col justify-start items-start p-5 overflow-y-auto h-64",
            isMobileMenuOpen ? "top-0 opacity-100 visible" : "-top-64 opacity-0 invisible",
            "xl:relative xl:top-auto xl:left-auto xl:w-auto xl:h-auto xl:bg-transparent xl:border-none xl:flex-row xl:items-center xl:p-0 xl:opacity-100 xl:visible xl:overflow-visible xl:z-auto"
        )}>

            <li className="relative mb-5 xl:mb-0 xl:mr-16 w-full xl:w-auto">
                <Link
                    href="/"
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors block"
                >
                    Anasayfa
                </Link>
            </li>

            <li className="relative mb-5 xl:mb-0 xl:mr-16 w-full xl:w-auto">
                <Link
                    href="/animeler"
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors block"
                >
                    Animeler
                </Link>
            </li>

            <li className="relative mb-5 xl:mb-0 xl:mr-16 w-full xl:w-auto">
                <Link
                    href="/filmler"
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors block"
                >
                    Filmler
                </Link>
            </li>

            <li className="relative mb-5 xl:mb-0 xl:mr-16 w-full xl:w-auto">
                <Link
                    href="/arsiv"
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors block"
                >
                    Arşiv
                </Link>
            </li>

            <li className="relative mb-5 xl:mb-0 xl:mr-16 w-full xl:w-auto">
                <Link
                    href="/takvim"
                    className="text-sm font-medium text-text-main hover:text-primary transition-colors block"
                >
                    Takvim
                </Link>
            </li>

        </ul>
    );
}
