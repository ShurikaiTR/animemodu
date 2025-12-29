import * as React from "react"

import { cn } from "@/shared/lib/utils"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    variant?: "default" | "modal";
}

const variantStyles = {
    default: "bg-bg-secondary border-white/10 placeholder:text-text-main/70 focus-visible:ring-1 focus-visible:ring-primary",
    modal: "bg-bg-input border-white/10 placeholder:text-text-main/40 focus-visible:border-primary",
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ className, type, variant = "default", ...props }, ref) => {
        return (
            <input
                type={type}
                className={cn(
                    "flex h-12 w-full rounded-xl border px-4 py-2 text-sm text-white ring-offset-bg-main file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 font-rubik",
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
