import Image from "next/image";
import { ShieldCheck } from "lucide-react";
import { Badge } from "@/shared/components/badge";
import { getAvatarUrl } from "@/shared/lib/utils";
import Container from "@/shared/components/container";
import ProfileActions from "./ProfileActions";
import ProfileSocials from "./ProfileSocials";
import ProfileStats from "./ProfileStats";
import ProfileInfoPills from "./ProfileInfoPills";
import type { ProfileRow } from "@/shared/types/helpers";

interface UserProfile extends ProfileRow {
    email: string;
    joinDate?: string;
    age: string | null;
    followers?: string;
    following?: string;
    avatar?: string;
}

interface ProfileHeaderProps {
    user: UserProfile;
    isOwnProfile?: boolean;
}

export default async function ProfileHeader({ user, isOwnProfile = true }: ProfileHeaderProps) {
    const avatarSrc = getAvatarUrl(user.avatar_url || user.avatar);

    return (
        <Container className="px-4 sm:px-6 mb-8">
            <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-bg-secondary border border-white/5 shadow-2xl">
                {/* Banner */}
                <div className="relative h-32 sm:h-48 md:h-64 lg:h-72 w-full">
                    <Image
                        src={user.banner_url || "/img/banner-placeholder.jpg"}
                        alt="Kapak Fotoğrafı"
                        fill
                        className="object-cover"
                        priority
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                </div>

                {/* Profile Info */}
                <div className="relative px-4 sm:px-6 md:px-10 pb-6 sm:pb-8 pt-16 sm:pt-16 md:pt-4 bg-bg-secondary/50">
                    {/* Avatar */}
                    <div className="absolute -top-12 left-1/2 -translate-x-1/2 sm:translate-x-0 sm:left-6 md:left-10 sm:-top-16 md:-top-20 z-10">
                        <div className="relative w-24 h-24 sm:w-32 sm:h-32 md:w-40 md:h-40 rounded-full sm:rounded-2xl md:rounded-3xl overflow-hidden border-4 border-primary bg-bg-secondary shadow-2xl ring-4 ring-black/20">
                            <Image
                                src={avatarSrc}
                                alt={user.username || "Kullanıcı"}
                                fill
                                className="object-cover"
                                priority
                            />
                            {user.role === "admin" && (
                                <div className="absolute bottom-1 right-1 sm:bottom-2 sm:right-2 w-3 h-3 sm:w-4 sm:h-4 bg-green-500 border-2 border-bg-secondary rounded-full shadow-lg z-20" />
                            )}
                        </div>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col gap-6">
                        <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 sm:gap-6">
                            {/* Left Side: Info */}
                            <div className="flex flex-col items-center sm:items-start text-center sm:text-left space-y-4 sm:pl-36 md:pl-44 lg:pl-48 w-full">
                                {/* Name & Badge */}
                                <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3">
                                    <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white tracking-tight">
                                        {user.full_name || user.username}
                                    </h1>
                                    {user.full_name && user.username && (
                                        <span className="text-text-main/40 text-sm sm:text-lg font-medium">
                                            @{user.username}
                                        </span>
                                    )}
                                    {user.role === "admin" && (
                                        <Badge variant="blue" className="px-2 sm:px-3 py-0.5 sm:py-1 font-medium rounded-full text-xs flex items-center gap-1 sm:gap-1.5 backdrop-blur-md bg-blue-500/10 border-blue-500/20 text-blue-400">
                                            <ShieldCheck className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
                                            Yönetici
                                        </Badge>
                                    )}
                                </div>

                                <ProfileStats followers={user.followers || "0"} following={user.following || "0"} />

                                {user.bio && (
                                    <p className="text-text-main/70 text-sm sm:text-base leading-relaxed max-w-2xl px-2 sm:px-0">
                                        {user.bio}
                                    </p>
                                )}

                                <ProfileInfoPills age={user.age} location={user.location} joinDate={user.joinDate} />
                            </div>

                            {/* Right Side: Actions (Desktop) - Moves to bottom on mobile */}
                            <div className="hidden sm:flex flex-col items-end gap-3 self-start shrink-0">
                                <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                                <ProfileSocials />
                            </div>
                        </div>

                        {/* Mobile Actions Stack */}
                        <div className="flex sm:hidden flex-col items-center gap-4 pt-2 border-t border-white/5 w-full">
                            <ProfileActions user={user} isOwnProfile={isOwnProfile} />
                            <div className="scale-110 pt-2">
                                <ProfileSocials />
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Container>
    );
}
