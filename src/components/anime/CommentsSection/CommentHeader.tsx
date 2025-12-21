
"use client";

import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { ShieldCheck, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";

interface CommentHeaderProps {
    username: string;
    author: string;
    role: string;
    timeAgo: string;
    likes: number;
}

export default function CommentHeader({ username, author, role, timeAgo, likes }: CommentHeaderProps) {
    return (
        <div className="flex items-center gap-2 mb-1.5">
            <Link href={`/profil/${username}`} className={cn("font-semibold text-sm hover:underline", role === "Admin" ? "text-primary" : "text-white/90")}>{author}</Link>
            {role === "Admin" && (
                <Badge variant="blue" className="px-2 py-0.5 font-bold rounded-full text-xs flex items-center gap-1">
                    <ShieldCheck className="w-3 h-3" />
                    Yönetici
                </Badge>
            )}
            <span className="text-white/20">•</span>
            <span className="text-white/40 text-xs">{timeAgo}</span>
            {likes > 5 && (
                <span className="flex items-center gap-1 text-amber-400/80 text-xs ml-auto"><Sparkles className="w-3 h-3" /> Popüler</span>
            )}
        </div>
    );
}
