"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";

import { forgotPasswordAction, loginAction, registerAction } from "@/features/auth/actions/auth-actions";
import { useAuth } from "@/shared/contexts/AuthContext";

import { type AuthState } from "./authConfig";
import AuthFormActions from "./AuthFormActions";
import AuthFormFields from "./AuthFormFields";

interface AuthFormProps {
    authState: AuthState;
    onStateChange: (state: AuthState) => void;
    onClose: () => void;
}

export default function AuthForm({ authState, onStateChange, onClose }: AuthFormProps) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const router = useRouter();
    const { refreshSession } = useAuth();


    const handleAuth = async (formData: FormData) => {
        setError(null);
        setLoading(true);
        const startTime = Date.now();

        try {
            let result;

            // Pass null as prevState to mimic useActionState if needed, or simply pass formData
            // The actions expect (prevState, formData) because they are designed for usage with useActionState/useFormState
            if (authState === "login") {
                result = await loginAction(null, formData);
            } else if (authState === "register") {
                result = await registerAction(null, formData);
            } else if (authState === "forgot-password") {
                result = await forgotPasswordAction(null, formData);
            }

            if (!result?.success) {
                throw new Error(result?.error || "Bir hata oluştu");
            }

            // Minimum yükleme süresini bekle (Animasyon için)
            const elapsed = Date.now() - startTime;
            if (elapsed < 1500) {
                await new Promise(resolve => setTimeout(resolve, 1500 - elapsed));
            }

            if (authState === "login") {
                await refreshSession(); // Client state'i güncelle
                toast.success("Giriş başarılı!", {
                    description: `Hoş geldiniz!`,
                    duration: 3000,
                });
                onClose();
                router.refresh();
            } else if (authState === "register") {
                await refreshSession(); // Client state'i güncelle
                toast.success("Kayıt başarılı!", {
                    description: result.data?.message || "Email adresinizi kontrol edin.",
                    duration: 5000,
                });
                onClose();
                router.refresh();
            } else if (authState === "forgot-password") {
                toast.success("İşlem başarılı!", {
                    description: result.data?.message || "Email gönderildi.",
                    duration: 5000,
                });
                onClose();
            }
        } catch (err) {
            // Hata durumunda da minimum süreyi bekle
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
                handleAuth(new FormData(e.currentTarget));
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
            />

            <AuthFormActions
                authState={authState}
                loading={loading}
                error={error}
                onStateChange={onStateChange}
            />
        </form>
    );
}




