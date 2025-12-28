import { Suspense } from "react";
import PublicProfileContent from "./PublicProfileContent";
import ProfileSkeleton from "@/features/profile/components/ProfileSkeleton";

interface PageProps {
    params: Promise<{ username: string }>;
}

export default async function PublicProfilePage({ params }: PageProps) {
    const { username } = await params;

    return (
        <Suspense fallback={<ProfileSkeleton />}>
            <PublicProfileContent username={username} />
        </Suspense>
    );
}
