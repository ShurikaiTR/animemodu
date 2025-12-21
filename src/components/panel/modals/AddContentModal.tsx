"use client";

import { useState, useEffect } from "react";
import { useFormStatus } from "react-dom";
import { Dialog, DialogContent, DialogFooter, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, List, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { AddContentModalHeader } from "./AddContentModalHeader";
import { addAnimeToDB } from "@/actions/anime";
import { toast } from "sonner";
import type { SearchResult } from "@/app/panel/types";

interface AddContentModalProps {
    isOpen: boolean;
    onClose: () => void;
    item: SearchResult | null;
}

function SubmitButton() {
    const { pending } = useFormStatus();
    return (
        <Button
            type="submit"
            disabled={pending}
            className="h-10 bg-primary hover:bg-primary/90 text-white min-w-36 rounded-lg font-bold text-sm shadow-lg shadow-primary/20"
        >
            {pending ? (
                <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Ekleniyor...
                </>
            ) : (
                "Veritabanına Ekle"
            )}
        </Button>
    );
}

export function AddContentModal({ isOpen, onClose, item }: AddContentModalProps) {
    const [title, setTitle] = useState("");
    const [structureType, setStructureType] = useState<"seasonal" | "absolute">("seasonal");

    useEffect(() => {
        if (item) {
            setTitle(item.title || item.name || "");
            setStructureType("seasonal");
        }
    }, [item]);

    const handleSubmit = async (formData: FormData) => {
        if (!item) return;

        formData.set("tmdbItem", JSON.stringify(item));
        formData.set("customTitle", title);
        formData.set("structureType", structureType);

        const result = await addAnimeToDB(formData);

        if (result.success) {
            toast.success(`"${title}" ve tüm içeriği başarıyla veritabanına eklendi!`);
            onClose();
        } else {
            toast.error(result.error || "Bir hata oluştu");
        }
    };

    if (!item) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent className="max-w-xl bg-bg-main border-white/5 p-0 overflow-hidden text-white sm:rounded-2xl shadow-2xl">
                <DialogTitle className="sr-only">İçerik Ekle</DialogTitle>
                <AddContentModalHeader item={item} />

                <form action={handleSubmit} className="flex flex-col">
                    <div className="px-6 pt-12 pb-6 space-y-6">
                        {item.media_type === "tv" && (
                            <div className="space-y-3">
                                <Label className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Bölüm Yapısı</Label>
                                <div className="grid grid-cols-2 gap-3">
                                    <button type="button" onClick={() => setStructureType("seasonal")} className={cn("flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200", structureType === "seasonal" ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10")}>
                                        <Layers className="w-5 h-5" />
                                        <div className="text-center">
                                            <div className="font-bold text-sm">Sezonlu</div>
                                            <div className="text-xs opacity-60">S1, S2...</div>
                                        </div>
                                    </button>
                                    <button type="button" onClick={() => setStructureType("absolute")} className={cn("flex flex-col items-center justify-center gap-2 p-3 rounded-xl border transition-all duration-200", structureType === "absolute" ? "bg-primary/10 border-primary text-primary" : "bg-white/5 border-white/5 text-gray-400 hover:bg-white/10")}>
                                        <List className="w-5 h-5" />
                                        <div className="text-center">
                                            <div className="font-bold text-sm">Tek Liste</div>
                                            <div className="text-xs opacity-60">EP1 - ∞</div>
                                        </div>
                                    </button>
                                </div>
                            </div>
                        )}
                        <div className="space-y-3">
                            <Label htmlFor="title" className="text-xs font-semibold text-gray-400 uppercase tracking-widest pl-1">Son Düzenleme (Başlık)</Label>
                            <Input id="title" name="title" value={title} onChange={(e) => setTitle(e.target.value)} className="bg-bg-secondary/50 border-white/5 text-white focus:border-primary/30 h-11 px-4 rounded-lg text-sm" placeholder="İçerik başlığını düzenleyebilirsiniz" required />
                        </div>
                    </div>

                    <DialogFooter className="px-6 py-4 bg-white/5 border-t border-white/5 flex flex-col sm:flex-row gap-3">
                        <Button type="button" variant="ghost" onClick={onClose} className="h-10 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg text-sm">Vazgeç</Button>
                        <SubmitButton />
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
