import * as React from "react";

import { cn } from "@/shared/lib/utils";

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    variant?: "default" | "panel";
}

const variantStyles = {
    default: "bg-bg-secondary border-white/10 placeholder:text-text-main/70 focus-visible:ring-1 focus-visible:ring-primary font-rubik",
    panel: "pl-11 border-white/5 bg-white/[0.03] placeholder-text-main/20 focus:bg-white/[0.05] focus:border-primary/50 focus:ring-1 focus:ring-primary/50 shadow-sm font-inter font-medium leading-relaxed",
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ className, variant = "default", ...props }, ref) => {
        return (
            <textarea
                className={cn(
                    "flex min-h-20 w-full rounded-xl border px-4 py-3 text-sm text-white ring-offset-bg-main focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-300 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent hover:scrollbar-thumb-white/20 resize-none",
                    variantStyles[variant],
                    className
                )}
                ref={ref}
                {...props}
            />
        );
    }
);
Textarea.displayName = "Textarea";

export { Textarea };









