"use client";

import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface ModalActionsProps {
    isPending: boolean;
    onCancel: () => void;
}

/**
 * Modal alt kısım - kaydet/iptal butonları
 */
export default function ModalActions({ isPending, onCancel }: ModalActionsProps) {
    return (
        <div className="p-6 border-t border-white/5 bg-bg-secondary flex justify-end gap-3 z-10">
            <Button
                type="button"
                variant="ghost"
                disabled={isPending}
                onClick={onCancel}
                className="hover:bg-white/5 text-text-main/70 hover:text-text-main h-11 px-6 rounded-xl"
            >
                İptal
            </Button>
            <Button
                type="submit"
                disabled={isPending}
                className="bg-primary hover:bg-primary/90 text-white font-bold h-11 px-8 rounded-xl shadow-lg shadow-primary/20 transition-transform active:scale-95 disabled:opacity-70"
            >
                {isPending ? (
                    <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                        className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full mr-2"
                    />
                ) : (
                    <Check className="w-4 h-4 mr-2" />
                )}
                Kaydet
            </Button>
        </div>
    );
}
