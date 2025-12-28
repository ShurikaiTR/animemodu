"use client";

import { Button } from "@/shared/components/button";
import { LogIn, UserPlus, Sparkles } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { useAuthModal } from "@/shared/contexts/AuthModalContext";

interface LoginPromptProps {
    compact?: boolean;
}

export default function LoginPrompt({ compact }: LoginPromptProps) {
    const { openAuthModal } = useAuthModal();

    return (
        <div className={cn("py-20 text-center flex flex-col items-center justify-center", compact && "py-10")}>
            <div className="w-20 h-20 bg-white/5 rounded-full flex items-center justify-center mb-6">
                <Sparkles className="w-8 h-8 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Giriş Yap</h3>
            <p className="text-white/40 mb-6">Yorum yapmak için hesabına giriş yap</p>
            <div className="flex items-center gap-3">
                <Button size="sm" className="h-10 px-6 text-sm font-medium rounded-lg bg-primary hover:bg-primary/90" onClick={() => openAuthModal("login")}>
                    <LogIn className="w-4 h-4 mr-2" /> Giriş Yap
                </Button>
                <Button size="sm" variant="glass" className="h-10 px-6 text-sm font-medium rounded-lg" onClick={() => openAuthModal("register")}>
                    <UserPlus className="w-4 h-4 mr-2" /> Kayıt Ol
                </Button>
            </div>
        </div>
    );
}
