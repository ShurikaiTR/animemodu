"use client";

import Image from "next/image";
import { cn } from "@/lib/utils";
import { AUTH_CONFIG, type AuthState } from "./authConfig";

interface AuthVisualProps {
    authState: AuthState;
}

export default function AuthVisual({ authState }: AuthVisualProps) {
    const config = AUTH_CONFIG[authState];

    return (
        <div className="hidden md:block w-5/12 relative overflow-hidden group">
            <Image
                src={config.image}
                alt={config.imageAlt}
                fill
                sizes="(max-width: 768px) 0vw, 42vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className={cn("absolute inset-0 bg-gradient-to-t opacity-60", config.accent)} />
            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/80" />
            <div className="absolute bottom-8 left-8 right-8 text-white z-10">
                <h3 className="text-3xl font-bold font-rubik leading-tight mb-2 drop-shadow-lg">{config.title}</h3>
                <p className="text-white/80 text-sm leading-relaxed">{config.desc}</p>
            </div>
        </div>
    );
}

