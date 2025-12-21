import { Suspense } from "react";
import { UsersContent } from "./UsersContent";
import UsersLoading from "./loading";

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
