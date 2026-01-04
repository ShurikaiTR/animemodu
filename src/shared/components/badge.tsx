import { cva, type VariantProps } from "class-variance-authority"
import * as React from "react"

import { cn } from "@/shared/lib/utils"

const badgeVariants = cva(
    "inline-flex items-center rounded px-2 py-0.5 text-xs font-bold tracking-wide whitespace-nowrap transition-colors border",
    {
        variants: {
            variant: {
                default: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
                purple: "bg-purple-500/10 text-purple-400 border-purple-500/20",
                teal: "bg-teal-500/10 text-teal-400 border-teal-500/20",
                gray: "bg-white/5 text-text-main/80 border-white/10",
                outline: "text-foreground",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
)

export interface BadgeProps
    extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> { }

function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <div className={cn(badgeVariants({ variant }), className)} {...props} />
    )
}

export { Badge, badgeVariants }
