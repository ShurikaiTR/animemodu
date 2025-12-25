"use client";

import { Twitter, Instagram, Github, Globe } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { ProfileRow } from "@/types/helpers";

interface SocialsTabProps {
    user: ProfileRow & { socials?: { twitter?: string; instagram?: string; github?: string; website?: string } };
}

export default function SocialsTab({ user }: SocialsTabProps) {
    return (
        <div className="space-y-6">
            <div className="space-y-2">
                <Label className="text-text-main/50">Twitter / X</Label>
                <div className="relative group focus-within:text-twitter transition-colors">
                    <Twitter className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-twitter transition-colors" />
                    <Input defaultValue={user.socials?.twitter} className="pl-10 focus:border-twitter/50" placeholder="https://twitter.com/..." />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Instagram</Label>
                <div className="relative group focus-within:text-instagram transition-colors">
                    <Instagram className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-instagram transition-colors" />
                    <Input defaultValue={user.socials?.instagram} className="pl-10 focus:border-instagram/50" placeholder="https://instagram.com/..." />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Github</Label>
                <div className="relative group focus-within:text-white transition-colors">
                    <Github className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-white transition-colors" />
                    <Input defaultValue={user.socials?.github} className="pl-10 focus:border-white/50" placeholder="https://github.com/..." />
                </div>
            </div>
            <div className="space-y-2">
                <Label className="text-text-main/50">Web Sitesi</Label>
                <div className="relative group focus-within:text-primary transition-colors">
                    <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-main/30 group-focus-within:text-primary transition-colors" />
                    <Input defaultValue={user.socials?.website} className="pl-10 focus:border-primary/50" placeholder="https://..." />
                </div>
            </div>
        </div>
    );
}





















