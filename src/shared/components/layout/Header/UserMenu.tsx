"use client";

import { User } from "@supabase/supabase-js";
import { ChevronDown, LogOut, Settings, User as UserIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/shared/components/dropdown-menu";
import { createClient } from "@/shared/lib/supabase/client";
import { getAvatarUrl } from "@/shared/lib/utils";

interface UserMenuProps {
    user: User | null;
    signOut: () => Promise<void>;
}

export default function UserMenu({ user, signOut }: UserMenuProps) {
    const [avatarUrl, setAvatarUrl] = useState<string | null>(null);
    const [username, setUsername] = useState<string>("User");

    useEffect(() => {
        if (!user) return;

        const fetchProfile = async () => {
            const supabase = createClient();
            const { data: profile } = await supabase
                .from("profiles")
                .select("avatar_url, username, full_name")
                .eq("id", user.id)
                .single();

            if (profile) {
                const profileData = profile as {
                    avatar_url: string | null;
                    username: string | null;
                    full_name: string | null;
                };
                setAvatarUrl(profileData.avatar_url);
                setUsername(profileData.username || profileData.full_name || user.user_metadata?.username || user.email?.split("@")[0] || "User");
            } else {
                setUsername(user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split("@")[0] || "User");
            }
        };

        fetchProfile();
    }, [user]);

    if (!user) return null;

    const userEmail = user.email;
    const displayUsername = username || user.user_metadata?.username || user.user_metadata?.full_name || user.email?.split("@")[0] || "User";

    return (
        <DropdownMenu>
            <DropdownMenuTrigger className="outline-none">
                <div className="flex items-center gap-3 cursor-pointer group p-1.5 pr-2.5 rounded-full hover:bg-white/5 transition-all duration-300 border border-transparent hover:border-white/5 data-[state=open]:bg-white/5 data-[state=open]:border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-primary/30 group-hover:from-primary/30 group-hover:to-primary/10 transition-all shadow-[0_0_10px_-5px_var(--color-primary)] overflow-hidden">
                        {avatarUrl ? (
                            <Image
                                src={getAvatarUrl(avatarUrl)}
                                alt={displayUsername}
                                width={32}
                                height={32}
                                className="w-full h-full object-cover"
                            />
                        ) : (
                            <span className="text-primary font-bold text-sm">
                                {displayUsername.charAt(0).toUpperCase()}
                            </span>
                        )}
                    </div>
                    <div className="hidden sm:flex flex-col items-start text-left">
                        <span className="text-sm font-medium text-white max-w-32 truncate group-hover:text-primary transition-colors">
                            {displayUsername}
                        </span>
                    </div>
                    <ChevronDown className="w-4 h-4 text-white/50 group-hover:text-primary transition-colors duration-300 ml-1 group-data-[state=open]:rotate-180" />
                </div>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-64 bg-bg-dropdown/95 backdrop-blur-xl border-white/10 text-white p-2 shadow-2xl rounded-xl mt-2 animate-in fade-in zoom-in-95 duration-200">
                <DropdownMenuLabel className="font-normal p-0 mb-2">
                    <div className="flex flex-col space-y-1 bg-white/5 p-3 rounded-lg border border-white/5">
                        <p className="text-sm font-medium leading-none text-white">Hesabım</p>
                        <p className="text-xs leading-none text-white/50 truncate font-mono mt-1.5">
                            {userEmail}
                        </p>
                    </div>
                </DropdownMenuLabel>

                <div className="space-y-1">
                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg p-2.5 transition-colors">
                        <Link href="/profil" className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-white/5 text-white/70 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                <UserIcon className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Profil</span>
                        </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild className="focus:bg-primary/10 focus:text-primary cursor-pointer rounded-lg p-2.5 transition-colors">
                        <Link href="/settings" className="flex items-center gap-2.5">
                            <div className="p-1.5 rounded-md bg-white/5 text-white/70 group-hover:bg-primary/20 group-hover:text-primary transition-colors">
                                <Settings className="h-4 w-4" />
                            </div>
                            <span className="font-medium">Ayarlar</span>
                        </Link>
                    </DropdownMenuItem>
                </div>

                <DropdownMenuSeparator className="bg-white/10 my-2" />

                <DropdownMenuItem
                    className="group text-red-500 focus:bg-red-500/10 focus:text-red-500 cursor-pointer rounded-lg p-2.5 transition-colors"
                    onClick={signOut}
                >
                    <div className="flex items-center gap-2.5 w-full">
                        <div className="p-1.5 rounded-md bg-red-500/10 text-red-500 group-hover:bg-red-500/20 transition-colors">
                            <LogOut className="h-4 w-4" />
                        </div>
                        <span className="font-medium">Çıkış Yap</span>
                    </div>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}
