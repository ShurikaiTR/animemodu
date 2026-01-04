"use client";

import { ArrowRight } from "lucide-react";

import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils";

import { AUTH_CONFIG, type AuthState } from "./authConfig";

interface AuthFormActionsProps {
    authState: AuthState;
    loading: boolean;
    error: string | null;
    onStateChange: (state: AuthState) => void;
}

export default function AuthFormActions({
    authState,
    loading,
    error,
    onStateChange
}: AuthFormActionsProps) {
    const config = AUTH_CONFIG[authState];

    return (
        <>
            {authState === "login" && (
                <div className="flex items-center gap-3 my-4">
                    <label className="relative inline-flex items-center cursor-pointer group">
                        <input type="checkbox" className="sr-only peer" />
                        <div className="w-10 h-6 bg-white/10 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-0.5 after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary border border-white/10 transition-colors duration-300 group-hover:bg-white/20 ease-in-out"></div>
                        <span className="ml-3 text-sm font-medium text-white/60 group-hover:text-white/90 transition-colors">Beni hatırla</span>
                    </label>
                </div>
            )}

            {error && (
                <div className="text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                    {error}
                </div>
            )}

            <Button
                type="submit"
                className={cn("w-full h-12 text-base font-bold mt-2 transition-all duration-300", config.btnColor, config.shadowClass, config.ringClass)}
                disabled={loading}
            >
                {loading ? (
                    <div className="flex items-center gap-1">
                        <span>Giriş Yapılıyor</span>
                        <div className="flex gap-1 ml-1">
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.3s]"></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce [animation-delay:-0.15s]"></span>
                            <span className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></span>
                        </div>
                    </div>
                ) : (
                    <>
                        {authState === "login" && "Giriş Yap"}
                        {authState === "register" && "Kayıt Ol"}
                        {authState === "forgot-password" && "Bağlantı Gönder"}
                        <ArrowRight className="w-5 h-5 ml-2" />
                    </>
                )}
            </Button>

            <div className="relative my-4">
                <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-white/10" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-bg-dark px-2 text-white/40">veya</span>
                </div>
            </div>

            <div className="text-center text-sm text-white/40">
                {authState === "login" && (
                    <>
                        Hesabın yok mu?{" "}
                        <button onClick={() => onStateChange("register")} className="text-primary hover:text-white transition-colors font-bold">Kayıt Ol</button>
                        <div className="mt-4">
                            <button onClick={() => onStateChange("forgot-password")} className="text-white/30 hover:text-white transition-colors text-xs">Şifremi Unuttum</button>
                        </div>
                    </>
                )}
                {authState === "register" && (
                    <>
                        Zaten hesabın var mı?{" "}
                        <button onClick={() => onStateChange("login")} className="text-primary hover:text-white transition-colors font-bold">Giriş Yap</button>
                    </>
                )}
                {authState === "forgot-password" && (
                    <>
                        <button onClick={() => onStateChange("login")} className="text-white hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto">
                            Giriş Ekranına Dön
                        </button>
                    </>
                )}
            </div>
        </>
    );
}
