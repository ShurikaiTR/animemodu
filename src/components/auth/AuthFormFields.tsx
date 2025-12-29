"use client";

import { Lock, User } from "lucide-react";
import { Input } from "@/shared/components/input";
import { type AuthState } from "./authConfig";

interface AuthFormFieldsProps {
    authState: AuthState;
    email: string;
    password: string;
    username: string;
    onEmailChange: (value: string) => void;
    onPasswordChange: (value: string) => void;
    onUsernameChange: (value: string) => void;
}

export default function AuthFormFields({
    authState,
    email,
    password,
    username,
    onEmailChange,
    onPasswordChange,
    onUsernameChange
}: AuthFormFieldsProps) {
    return (
        <div className="space-y-4">
            {authState === "register" && (
                <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
                    <Input
                        type="text"
                        placeholder="Kullanıcı Adı"
                        value={username}
                        onChange={(e) => onUsernameChange(e.target.value)}
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
                    placeholder="E-posta Adresi"
                    value={email}
                    onChange={(e) => onEmailChange(e.target.value)}
                    className="h-12 pl-12"
                />
            </div>

            {authState !== "forgot-password" && (
                <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30 z-10" />
                    <Input
                        type="password"
                        placeholder="Şifre"
                        value={password}
                        onChange={(e) => onPasswordChange(e.target.value)}
                        className="h-12 pl-12"
                    />
                </div>
            )}
        </div>
    );
}










