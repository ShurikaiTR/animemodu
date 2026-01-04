"use client";

import Image from "next/image";
import Link from "next/link";

import { cn } from "@/shared/lib/utils";

import { useAdmin } from "./AdminContext";

export default function AdminHeader() {
    const { isSidebarOpen, toggleSidebar } = useAdmin();

    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-bg-secondary z-[100] flex items-center justify-between px-4 lg:hidden shadow-md transition-all duration-500">
            <Link href="/panel" className="block">
                <Image
                  src="/img/animemodu-logo.svg"
                  alt="AnimeModu"
                  width={100}
                  height={30}
                  className="h-8 w-auto"
                  style={{ width: "auto", height: "auto" }}
                  loading="eager"
                  priority
                />
            </Link>

            <button
                onClick={toggleSidebar}
                className="relative w-6 h-6 flex flex-col justify-between group focus:outline-none"
            >
                <span
                    className={cn(
                        "absolute right-0 h-0.5 bg-white rounded-full transition-all duration-500",
                        isSidebarOpen ? "w-6 top-2.5 rotate-45 bg-primary" : "w-6 top-0"
                    )}
                />
                <span
                    className={cn(
                        "absolute right-0 h-0.5 bg-white rounded-full transition-all duration-500",
                        isSidebarOpen ? "opacity-0" : "w-4 top-2.5"
                    )}
                />
                <span
                    className={cn(
                        "absolute right-0 h-0.5 bg-white rounded-full transition-all duration-500",
                        isSidebarOpen ? "w-6 top-2.5 -rotate-45 bg-primary" : "w-2 top-5"
                    )}
                />
            </button>
        </header>
    );
}
