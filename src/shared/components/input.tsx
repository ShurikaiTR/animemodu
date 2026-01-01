import * as React from "react"

import { cn } from "@/shared/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "modal" | "panel" | "panel-orange";
    /** Use monospace font (for URLs, codes, etc.) */
    mono?: boolean;
}

const variantStyles = {
    default: "bg-bg-secondary border-white/10 placeholder:text-text-main/70 focus-visible:ring-1 focus-visible:ring-primary",
    modal: "bg-bg-input border-white/10 placeholder:text-text-main/40 focus-visible:border-primary",
    panel: "pl-11 border-white/5 bg-white/[0.03] placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-sm",
    "panel-orange": "pl-11 border-white/5 bg-white/[0.03] placeholder-text-main/20 focus:bg-white/[0.05] focus:border-accent-orange/50 focus:ring-1 focus:ring-accent-orange/50 shadow-sm",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = "default", mono = false, ...props }, ref) => {
        const isPanel = variant === "panel" || variant === "panel-orange";
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border px-4 py-2 text-sm text-white ring-offset-bg-main file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300",
                    isPanel ? (mono ? "font-mono" : "font-inter") : "font-rubik",
                    isPanel && "font-medium",
                    variantStyles[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        )
    }
)
Input.displayName = "Input"

export { Input }

