"use client";

import { AlertCircle,CheckCircle2, Lock } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense,useState } from "react";

import { Button } from "@/shared/components/button";
import Container from "@/shared/components/container";
import { Input } from "@/shared/components/input";
import { createClient } from "@/shared/lib/supabase/client";

function ResetPasswordForm() {
    const router = useRouter();
    const searchParams = useSearchParams();
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState(false);
    const supabase = createClient();

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password.length < 6) {
            setError("Şifre en az 6 karakter olmalıdır.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Şifreler eşleşmiyor.");
            return;
        }

        setLoading(true);

        try {
            const { error } = await supabase.auth.updateUser({
                password: password,
            });

            if (error) throw error;

            setSuccess(true);
            setTimeout(() => {
                router.push(searchParams.get("next") || "/");
            }, 2000);
        } catch (err) {
            const errorMessage = err instanceof Error ? err.message : "Bir hata oluştu";
            setError(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <Container className="min-h-screen flex items-center justify-center py-20">
                <div className="max-w-md w-full bg-bg-secondary/50 border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <CheckCircle2 className="w-8 h-8 text-green-500" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 font-rubik">Şifre Başarıyla Güncellendi!</h1>
                    <p className="text-white/60 mb-6">Yeni şifrenizle giriş yapabilirsiniz.</p>
                    <p className="text-white/40 text-sm">Yönlendiriliyorsunuz...</p>
                </div>
            </Container>
        );
    }

    return (
        <Container className="min-h-screen flex items-center justify-center py-20">
            <div className="max-w-md w-full bg-bg-secondary/50 border border-white/5 rounded-2xl p-8">
                <div className="mb-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <h1 className="text-2xl font-bold text-white mb-2 font-rubik">Yeni Şifre Belirle</h1>
                    <p className="text-white/60 text-sm">Güvenli bir şifre seçin</p>
                </div>

                <form onSubmit={handleResetPassword} className="space-y-4">
                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <Input
                            type="password"
                            placeholder="Yeni Şifre"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-0 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-white/30" />
                        <Input
                            type="password"
                            placeholder="Şifreyi Tekrar Gir"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="h-12 pl-12 bg-white/5 border-white/10 text-white placeholder:text-white/30 focus:border-primary/50 focus:ring-0 transition-colors"
                            required
                            minLength={6}
                        />
                    </div>

                    {error && (
                        <div className="flex items-center gap-2 text-red-500 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </div>
                    )}

                    <Button
                        type="submit"
                        className="w-full h-12 text-base font-bold"
                        disabled={loading}
                    >
                        {loading ? "Güncelleniyor..." : "Şifreyi Güncelle"}
                    </Button>
                </form>
            </div>
        </Container>
    );
}

export default function ResetPasswordConfirmPage() {
    return (
        <Suspense fallback={
            <Container className="min-h-screen flex items-center justify-center py-20">
                <div className="max-w-md w-full bg-bg-secondary/50 border border-white/5 rounded-2xl p-8 text-center">
                    <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4 animate-pulse">
                        <Lock className="w-8 h-8 text-primary" />
                    </div>
                    <p className="text-white/60">Yükleniyor...</p>
                </div>
            </Container>
        }>
            <ResetPasswordForm />
        </Suspense>
    );
}




