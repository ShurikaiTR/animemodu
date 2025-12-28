
"use client";

import { createPortal } from "react-dom";
import { X, Trash2, AlertTriangle, Loader2 } from "lucide-react";
import { useModalMount } from "@/shared/hooks/useModalMount";
import { Button } from "@/shared/components/button";

interface DeleteConfirmationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: () => void;
    isPending: boolean;
    username?: string | null;
}

export function DeleteConfirmationModal({
    isOpen,
    onClose,
    onConfirm,
    isPending,
    username
}: DeleteConfirmationModalProps) {
    const mounted = useModalMount();

    if (!isOpen || !mounted) return null;

    return createPortal(
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-300 cursor-pointer"
            onClick={onClose}
        >
            <div
                className="bg-bg-dark w-full max-w-md rounded-3xl overflow-hidden border border-white/10 shadow-2xl relative animate-in zoom-in-95 duration-300 cursor-auto"
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/50 hover:bg-primary text-white flex items-center justify-center transition-colors border border-white/5"
                >
                    <X className="w-5 h-5" />
                </button>

                <div className="p-8">
                    <div className="flex items-center gap-4 mb-6">
                        <div className="w-16 h-16 rounded-full bg-red-500/10 flex items-center justify-center border border-red-500/20">
                            <AlertTriangle className="w-8 h-8 text-red-500" />
                        </div>
                        <div>
                            <h2 className="text-2xl font-bold text-white font-rubik mb-1">
                                Kullanıcıyı Sil
                            </h2>
                            <p className="text-sm text-white/60">
                                Bu işlem geri alınamaz
                            </p>
                        </div>
                    </div>

                    <div className="mb-8">
                        <p className="text-white/80 leading-relaxed">
                            <span className="font-bold text-white">{username || "Bu kullanıcı"}</span> adlı kullanıcıyı silmek istediğinize emin misiniz?
                        </p>
                        <p className="text-sm text-white/50 mt-3">
                            Kullanıcının tüm verileri (yorumlar, incelemeler, profil bilgileri) kalıcı olarak silinecektir.
                        </p>
                    </div>

                    <div className="flex items-center gap-3">
                        <Button
                            variant="ghost"
                            size="lg"
                            onClick={onClose}
                            disabled={isPending}
                            className="flex-1 hover:bg-white/10 hover:text-white border border-white/10 rounded-xl"
                        >
                            İptal
                        </Button>
                        <Button
                            size="lg"
                            onClick={onConfirm}
                            disabled={isPending}
                            className="flex-1 bg-red-500 hover:bg-red-600 text-white shadow-[0_0_20px_rgba(239,68,68,0.3)] hover:shadow-[0_0_40px_rgba(239,68,68,0.6)] font-bold rounded-xl"
                        >
                            {isPending ? (
                                <>
                                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                                    Siliniyor...
                                </>
                            ) : (
                                <>
                                    <Trash2 className="w-5 h-5 fill-current" />
                                    Evet, Sil
                                </>
                            )}
                        </Button>
                    </div>
                </div>
            </div>
        </div>,
        document.body
    );
}
