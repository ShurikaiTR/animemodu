"use client";

import { Lock, User } from "lucide-react";

import { Input } from "@/shared/components/input";

import { type AuthState } from "./authConfig";

interface AuthFormFieldsProps {
    authState: AuthState;
}

export default function AuthFormFields({
    authState,
}: AuthFormFieldsProps) {
    return (
        <div className="space-y-4">
            {authState === "register" && (
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
                    <Input
                        type="text"
                        name="username"
                        placeholder="Kullanıcı Adı"
                        className="h-12 pl-12"
                        required
                        minLength={3}
                    />
                </div>
            )}

            <div className="relative">
                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-white/30 z-10 font-bold text-lg">@</span>
                <Input
                    type="email"
                    name="email"
                    placeholder="E-posta Adresi"
                    className="h-12 pl-12"
                />
            </div>

            {authState !== "forgot-password" && (
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
                    <Input
                        type="password"
                        name="password"
                        placeholder="Şifre"
                        className="h-12 pl-12"
                    />
                </div>
            )}
        </div>
    );
}










