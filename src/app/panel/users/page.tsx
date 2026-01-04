import { Suspense } from "react";

import UsersLoading from "./loading";
import { UsersContent } from "./UsersContent";

export const metadata = {
    title: "Kullanıcılar - Admin Panel",
    description: "Kayıtlı kullanıcıları yönetin.",
};

export default function UsersPage() {
    return (
        <Suspense fallback={<UsersLoading />}>
            <UsersContent />
        </Suspense>
    );
}
