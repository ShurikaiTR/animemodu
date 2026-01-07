import type { Metadata } from "next";
import { Suspense } from "react";

import { getNotifications } from "@/features/notifications/actions";
import NotificationPageContent from "@/features/notifications/components/NotificationPageContent";
import type { Notification } from "@/shared/types/domain/notification";

export const metadata: Metadata = {
    title: "Bildirimler | AnimeModu",
    description: "Güncel aktiviteleriniz ve haberler.",
};

interface PageProps {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function NotificationsPage({ searchParams }: PageProps) {
    const params = await searchParams;
    const activeTab = typeof params.tab === "string" ? params.tab : "all";
    const activeFilter = typeof params.filtre === "string" ? params.filtre : "all";

    const result = await getNotifications(50, activeFilter, activeTab);
    const notifications = result.success && "data" in result ? (result.data as Notification[]) : [];

    return (
        <Suspense fallback={
            <div className="container mx-auto px-4 md:px-8 py-8 max-w-5xl animate-pulse">
                <div className="h-10 w-48 bg-white/5 rounded-lg mb-8" />
                <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
                    <div className="lg:col-span-1 space-y-4">
                        {[1, 2, 3, 4].map(i => (
                            <div key={i} className="h-10 bg-white/5 rounded-lg" />
                        ))}
                    </div>
                    <div className="lg:col-span-3 space-y-4">
                        {[1, 2, 3].map(i => (
                            <div key={i} className="h-24 bg-white/5 rounded-xl" />
                        ))}
                    </div>
                </div>
            </div>
        }>
            <NotificationPageContent
                initialNotifications={notifications}
                initialTab={activeTab}
                initialFilter={activeFilter}
            />
        </Suspense>
    );
}
