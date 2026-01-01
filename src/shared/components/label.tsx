"use client"

import * as React from "react"
import * as LabelPrimitive from "@radix-ui/react-label"

import { cn } from "@/shared/lib/utils"

interface LabelProps extends React.ComponentProps<typeof LabelPrimitive.Root> {
  variant?: "default" | "panel";
}

const variantStyles = {
  default: "font-medium",
  panel: "font-inter font-semibold text-text-main/60 ml-1",
};

function Label({
  className,
  variant = "default",
  ...props
}: LabelProps) {
  return (
    <LabelPrimitive.Root
      data-slot="label"
      className={cn(
        "flex items-center gap-2 text-sm leading-none select-none group-data-[disabled=true]:pointer-events-none group-data-[disabled=true]:opacity-50 peer-disabled:cursor-not-allowed peer-disabled:opacity-50",
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Label }

