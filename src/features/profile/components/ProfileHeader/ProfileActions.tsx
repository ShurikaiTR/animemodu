"use client";

import { Edit, Loader2, UserCheck, UserPlus } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { toggleFollow } from "@/features/profile/actions/follow-actions";
import EditProfileModal from "@/features/profile/components/EditProfileModal";
import { Button } from "@/shared/components/button";
import type { ProfileRow } from "@/shared/types/helpers";

interface ProfileActionsProps {
    user: ProfileRow & { email?: string };
    isOwnProfile?: boolean;
    initialIsFollowing?: boolean;
    targetUserId?: string;
}

export default function ProfileActions({
    user,
    isOwnProfile = true,
    initialIsFollowing = false,
    targetUserId,
}: ProfileActionsProps) {
    const [isFollowing, setIsFollowing] = useState(initialIsFollowing);
    const [isPending, startTransition] = useTransition();

    const handleFollowClick = () => {
        if (!targetUserId) return;

        startTransition(async () => {
            const result = await toggleFollow(targetUserId);

            if (result.success && 'data' in result && result.data) {
                const newStatus = !!result.data.isFollowing;
                setIsFollowing(newStatus);
                toast.success(newStatus ? "Takip edildi" : "Takip bırakıldı");
            } else {
                if (!result.success) {
                    toast.error(result.error);
                }
            }
        });
    };

    // Kendi profilimiz ise "Profil Düzenle" göster
    if (isOwnProfile) {
        return (
            <EditProfileModal user={user}>
                <Button
                    variant="default"
                    className="h-10 sm:h-11 px-4 sm:px-8 rounded-xl shadow-lg shadow-primary/20 text-sm sm:text-base w-full sm:w-auto"
                >
                    <Edit className="w-4 h-4 mr-2" />
                    <span className="hidden sm:inline">Profili düzenle</span>
                    <span className="sm:hidden">Düzenle</span>
                </Button>
            </EditProfileModal>
        );
    }

    // Başkasının profili ise "Takip Et" göster
    return (
        <Button
            variant={isFollowing ? "glass" : "default"}
            className={`h-10 sm:h-11 px-4 sm:px-8 rounded-xl text-sm sm:text-base w-full sm:w-auto ${!isFollowing ? "shadow-lg shadow-primary/20" : ""}`}
            onClick={handleFollowClick}
            disabled={isPending}
        >
            {isPending ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            ) : isFollowing ? (
                <UserCheck className="w-4 h-4 mr-2" />
            ) : (
                <UserPlus className="w-4 h-4 mr-2" />
            )}
            <span className="hidden sm:inline">
                {isFollowing ? "Takip Ediliyor" : "Takip Et"}
            </span>
            <span className="sm:hidden">
                {isFollowing ? "Takipte" : "Takip"}
            </span>
        </Button>
    );
}
