"use client";

import { User } from "@supabase/supabase-js";
import { useEffect,useState } from "react";

import { UserIcon } from "./HeaderIcons";
import UserMenu from "./UserMenu";

interface UserActionsProps {
    user: User | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
    onLoginClick: () => void;
}

export default function UserActions({ user, isLoading, signOut, onLoginClick }: UserActionsProps) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    // SSR ve ilk client render'da aynı şeyi göster (hydration mismatch önleme)
    if (!mounted || isLoading) {
        return <div className="w-8 h-8 rounded-full bg-white/5 animate-pulse" />;
    }

    if (user) {
        return <UserMenu user={user} signOut={signOut} />;
    }

    return (
        <button
            onClick={onLoginClick}
            className="flex items-center gap-2.5 group cursor-pointer"
            aria-label="Giriş yap"
        >
            <span className="text-sm font-medium text-text-main group-hover:text-primary transition-colors hidden sm:block">
                Giriş Yap
            </span>
            <span className="text-primary group-hover:text-primary transition-colors" aria-hidden="true">
                <UserIcon />
            </span>
        </button>
    );
}
