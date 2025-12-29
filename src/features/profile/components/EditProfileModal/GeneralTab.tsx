"use client";

import { User, Mail, MapPin, Calendar } from "lucide-react";
import { Input } from "@/shared/components/input";
import { Label } from "@/shared/components/label";
import type { ProfileRow } from "@/shared/types/helpers";

/** GeneralTab için genişletilmiş kullanıcı tipi */
interface GeneralTabUser extends ProfileRow {
    email?: string;
}

interface GeneralTabProps {
    user: GeneralTabUser;
}

export default function GeneralTab({ user }: GeneralTabProps) {
    return (
        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-text-main/50">Kullanıcı Adı</Label>
                    <div className="relative group">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20 transition-colors" />
                        <Input
                            name="username"
                            defaultValue={user.username || ""}
                            readOnly
                            variant="modal"
                            className="pl-10 opacity-60 cursor-not-allowed !bg-bg-dark"
                        />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-text-main/50">Ad Soyad</Label>
                    <div className="relative group focus-within:text-primary transition-colors">
                        <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-primary transition-colors" />
                        <Input
                            name="full_name"
                            defaultValue={user.full_name || ""}
                            variant="modal"
                            className="pl-10"
                            placeholder="Adınız Soyadınız"
                        />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-text-main/50">E-posta</Label>
                <div className="relative group transition-colors">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/20 transition-colors" />
                    <Input name="email" defaultValue={user.email} readOnly variant="modal" className="pl-10 opacity-60 cursor-not-allowed !bg-bg-dark" />
                </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label className="text-text-main/50">Konum</Label>
                    <div className="relative group focus-within:text-primary transition-colors">
                        <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-primary transition-colors" />
                        <Input name="location" defaultValue={user.location || ""} variant="modal" className="pl-10" placeholder="İstanbul, TR" />
                    </div>
                </div>
                <div className="space-y-2">
                    <Label className="text-text-main/50">Yaş</Label>
                    <div className="relative group focus-within:text-primary transition-colors">
                        <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-primary transition-colors" />
                        <Input name="age" defaultValue={user.age || ""} variant="modal" className="pl-10" placeholder="24" />
                    </div>
                </div>
            </div>

            <div className="space-y-2">
                <Label className="text-text-main/50">Biyografi</Label>
                <textarea
                    name="bio"
                    className="w-full min-h-32 bg-bg-input border border-white/10 rounded-xl p-4 text-sm text-text-main placeholder:text-text-main/40 focus:outline-none focus:ring-4 focus:ring-primary/20 focus:border-primary transition-all resize-none font-rubik"
                    placeholder="Kendinden bahset..."
                    defaultValue={user.bio || ""}
                />
            </div>
        </div>
    );
}








