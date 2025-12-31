"use client";

import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";

interface FormFieldProps {
    label: string;
    id: string;
    icon: ReactNode;
    children: ReactNode;
    extraLabelContent?: ReactNode;
    className?: string;
    iconAlign?: "center" | "top";
}

export function FormField({
    label,
    id,
    icon,
    children,
    extraLabelContent,
    className,
    iconAlign = "center"
}: FormFieldProps) {
    return (
        <div className={cn("space-y-2.5", className)}>
            <div className="flex items-center justify-between ml-1">
                <label className="font-inter text-sm font-semibold text-text-main/60" htmlFor={id}>
                    {label}
                </label>
                {extraLabelContent}
            </div>
            <div className="relative group">
                <div className={cn(
                    "absolute left-3.5 pointer-events-none transition-colors group-focus-within:text-primary text-text-main/30",
                    iconAlign === "center" ? "inset-y-0 flex items-center" : "top-4"
                )}>
                    {icon}
                </div>
                {children}
            </div>
        </div>
    );
}
