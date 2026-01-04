"use client";

import { createContext, useCallback,useState } from "react";

import type { AuthState } from "@/components/auth/authConfig";
import AuthModal from "@/components/auth/AuthModal";
import { createContextHook } from "@/shared/contexts/utils";

interface AuthModalContextType {
    openAuthModal: (view?: AuthState) => void;
    closeAuthModal: () => void;
}

const AuthModalContext = createContext<AuthModalContextType | undefined>(undefined);

export function AuthModalProvider({ children }: { children: React.ReactNode }) {
    const [isOpen, setIsOpen] = useState(false);
    const [initialView, setInitialView] = useState<AuthState>("login");

    const openAuthModal = useCallback((view: AuthState = "login") => {
        setInitialView(view);
        setIsOpen(true);
    }, []);

    const closeAuthModal = useCallback(() => {
        setIsOpen(false);
    }, []);

    return (
        <AuthModalContext.Provider value={{ openAuthModal, closeAuthModal }}>
            {children}
            <AuthModal isOpen={isOpen} onClose={closeAuthModal} initialView={initialView} />
        </AuthModalContext.Provider>
    );
}

export const useAuthModal = createContextHook(AuthModalContext, "useAuthModal", "AuthModalProvider");
