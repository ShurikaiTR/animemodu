"use client";

import { ReactNode } from "react";

interface SeoSectionProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
}

export function SeoSection({ title, icon, children }: SeoSectionProps) {
    return (
        <div className="p-6 lg:p-8 space-y-6">
            <h4 className="flex items-center gap-3 font-rubik text-lg font-bold text-white">
                {icon && (
                    <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        {icon}
                    </div>
                )}
                {title}
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8">{children}</div>
        </div>
    );
}
