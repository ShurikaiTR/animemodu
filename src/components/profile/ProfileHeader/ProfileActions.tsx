"use client";

import { Edit, UserPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import EditProfileModal from "@/components/profile/EditProfileModal";
import type { ProfileRow } from "@/types/helpers";

interface ProfileActionsProps {
    user: ProfileRow & { email?: string };
    isOwnProfile?: boolean;
}

export default function ProfileActions({ user, isOwnProfile = true }: ProfileActionsProps) {
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
            variant="default"
            className="h-10 sm:h-11 px-4 sm:px-8 rounded-xl shadow-lg shadow-primary/20 text-sm sm:text-base w-full sm:w-auto"
        >
            <UserPlus className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">Takip Et</span>
            <span className="sm:hidden">Takip</span>
        </Button>
    );
}
