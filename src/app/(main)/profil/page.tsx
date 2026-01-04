import { Suspense } from "react";

import ProfileContent from "@/features/profile/components/ProfileContent";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";

export default async function ProfilePage() {
    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <ProfileContent />
        </Suspense>
    );
}
