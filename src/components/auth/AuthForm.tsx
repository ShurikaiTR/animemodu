"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { type AuthState } from "./authConfig";
import AuthFormFields from "./AuthFormFields";
import AuthFormActions from "./AuthFormActions";

interface AuthFormProps {
    authState: AuthState;
    onStateChange: (state: AuthState) => void;
    onClose: () => void;
}

export default function AuthForm({ authState, onStateChange, onClose }: AuthFormProps) {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const supabase = createClient();

    const handleAuth = async () => {
        setError(null);
        setLoading(true);
        const startTime = Date.now();

        try {
            if (authState === "login") {
                const { error } = await supabase.auth.signInWithPassword({ email, password });
                if (error) throw error;

                // Minimum yükleme süresini bekle
                const elapsed = Date.now() - startTime;
                if (elapsed < 1500) {
                    await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
                }

                toast.success("Giriş başarılı!", {
                    description: `Hoş geldiniz!`,
                    duration: 3000,
                });

                onClose();
                router.refresh();
            } else if (authState === "register") {
                const { error } = await supabase.auth.signUp({
                    email,
                    password,
                    options: {
                        data: { full_name: username, username: username },
                        emailRedirectTo: `${window.location.origin}/auth/callback`,
                    },
                });
                if (error) throw error;

                // Minimum yükleme süresini bekle
                const elapsed = Date.now() - startTime;
                if (elapsed < 1500) {
                    await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
                }

                toast.success("Kayıt başarılı!", {
                    description: "Email adresinizi kontrol edin ve doğrulama linkine tıklayın.",
                    duration: 5000,
                });

                onClose();
                router.refresh();
            } else if (authState === "forgot-password") {
                const { error } = await supabase.auth.resetPasswordForEmail(email, {
                    redirectTo: `${window.location.origin}/auth/reset-password`,
                });
                if (error) throw error;

                // Minimum yükleme süresini bekle
                const elapsed = Date.now() - startTime;
                if (elapsed < 1500) {
                    await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
                }

                toast.success("Email gönderildi!", {
                    description: "Şifre sıfırlama linki email adresinize gönderildi. Lütfen email'inizi kontrol edin.",
                    duration: 5000,
                });

                onClose();
            }
        } catch (err) {
            // Hata durumunda da minimum süreyi bekle ki animasyon görünsün
            const elapsed = Date.now() - startTime;
            if (elapsed < 1500) {
                await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
            }

            const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form
            onSubmit={(e) => {
                e.preventDefault();
                handleAuth();
            }}
            className="w-full md:w-7/12 p-8 md:p-12 flex flex-col justify-center relative bg-bg-dark"
        >
            <div className="mb-8">
                <h2 className="text-2xl font-bold text-white mb-2 font-rubik">
                    {authState === "login" && "Giriş Yap"}
                    {authState === "register" && "Hesap Oluştur"}
                    {authState === "forgot-password" && "Şifre Sıfırla"}
                </h2>
                <p className="text-white/40 text-sm">
                    {authState === "login" && "Devam etmek için e-posta ve şifreni gir."}
                    {authState === "register" && "Sadece birkaç saniye içinde aramıza katıl."}
                    {authState === "forgot-password" && "E-posta adresini gir, sana bir bağlantı gönderelim."}
                </p>
            </div>

            <AuthFormFields
                authState={authState}
                email={email}
                password={password}
                username={username}
                onEmailChange={setEmail}
                onPasswordChange={setPassword}
                onUsernameChange={setUsername}
            />

            <AuthFormActions
                authState={authState}
                loading={loading}
                error={error}
                onAuth={handleAuth}
                onStateChange={onStateChange}
            />
        </form>
    );
}




