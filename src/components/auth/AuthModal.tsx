"use client";

import { X } from "lucide-react";
import { useEffect,useState } from "react";
import { createPortal } from "react-dom";

import { useModalMount } from "@/shared/hooks/useModalMount";

import type { AuthState } from "./authConfig";
import AuthForm from "./AuthForm";
import AuthVisual from "./AuthVisual";

interface AuthModalProps {
    isOpen: boolean;
    onClose: () => void;
    initialView?: AuthState;
}

export default function AuthModal({ isOpen, onClose, initialView = "login" }: AuthModalProps) {
    const [authState, setAuthState] = useState<AuthState>(initialView);
    const mounted = useModalMount();

    useEffect(() => {
        if (isOpen) setAuthState(initialView);
    }, [isOpen, initialView]);

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-bg-dark w-full max-w-4xl h-[min(600px,90vh)] rounded-3xl overflow-hidden border border-white/10 shadow-2xl flex relative animate-in zoom-in-95 duration-300 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors"
                >
                    <X className="w-5 h-5" />
                </button>

                <AuthVisual authState={authState} />
                <AuthForm authState={authState} onStateChange={setAuthState} onClose={onClose} />
            </div>
        </div>,
        document.body
    );
}
