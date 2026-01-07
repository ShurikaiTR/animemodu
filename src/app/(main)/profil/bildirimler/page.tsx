import type { Metadata } from "next";

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
        <NotificationPageContent
            initialNotifications={notifications}
            initialTab={activeTab}
            initialFilter={activeFilter}
        />
    );
}
