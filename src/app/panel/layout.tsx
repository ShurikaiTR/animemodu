"use client";

import { type ReactNode,Suspense } from "react";

import { AdminProvider } from "@/components/panel/layout/AdminContext";
import AdminHeader from "@/components/panel/layout/AdminHeader";
import AdminSidebar from "@/components/panel/layout/AdminSidebar";

interface AdminLayoutProps {
    children: ReactNode;
}

function AdminSidebarFallback() {
    return (
        <aside className="fixed top-0 left-0 z-[101] w-72 h-screen bg-bg-main border-r border-primary/10 flex flex-col -translate-x-full lg:translate-x-0">
            <div className="h-20 flex items-center px-8 border-b border-primary/10 bg-bg-main">
                <div className="h-9 w-32 bg-white/5 animate-pulse rounded" />
            </div>
            <div className="p-8 border-b border-primary/10">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/5 animate-pulse" />
                    <div className="space-y-2">
                        <div className="h-3 w-12 bg-white/5 animate-pulse rounded" />
                        <div className="h-4 w-24 bg-white/5 animate-pulse rounded" />
                    </div>
                </div>
            </div>
            <nav className="flex-1 py-8 px-4 space-y-2">
                {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-12 bg-white/5 animate-pulse rounded-xl" />
                ))}
            </nav>
        </aside>
    );
}

function AdminHeaderFallback() {
    return (
        <header className="fixed top-0 left-0 right-0 h-20 bg-bg-main border-b border-primary/10 lg:hidden z-50">
            <div className="h-full flex items-center justify-between px-4">
                <div className="h-8 w-8 bg-white/5 animate-pulse rounded" />
                <div className="h-8 w-32 bg-white/5 animate-pulse rounded" />
                <div className="h-8 w-8 bg-white/5 animate-pulse rounded" />
            </div>
        </header>
    );
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <AdminProvider>
            <div className="min-h-screen bg-bg-main font-inter text-white selection:bg-white selection:text-bg-secondary">
                <Suspense fallback={<AdminHeaderFallback />}>
                    <AdminHeader />
                </Suspense>

                <div className="flex">
                    <Suspense fallback={<AdminSidebarFallback />}>
                        <AdminSidebar />
                    </Suspense>

                    <main className="flex-1 pt-20 lg:pt-0 min-h-screen transition-all duration-500">
                        <div className="p-5 lg:p-8">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </AdminProvider>
    );
}

