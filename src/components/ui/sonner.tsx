"use client"

import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react"
import { Toaster as Sonner, type ToasterProps } from "sonner"

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="light"
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-bg-secondary group-[.toaster]:text-text-main group-[.toaster]:border-white/5 group-[.toaster]:shadow-2xl group-[.toaster]:shadow-black/50 group-[.toaster]:rounded-xl font-inter",
          description: "group-[.toast]:text-text-main/60",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-white font-bold",
          cancelButton:
            "group-[.toast]:bg-white/5 group-[.toast]:text-text-main hover:group-[.toast]:bg-white/10",
          success: "group-[.toaster]:!border-green-500/20 group-[.toaster]:!bg-green-500/10 group-[.toaster]:!text-green-400",
          error: "group-[.toaster]:!border-red-500/20 group-[.toaster]:!bg-red-500/10 group-[.toaster]:!text-red-400",
          warning: "group-[.toaster]:!border-yellow-500/20 group-[.toaster]:!bg-yellow-500/10 group-[.toaster]:!text-yellow-400",
          info: "group-[.toaster]:!border-blue-500/20 group-[.toaster]:!bg-blue-500/10 group-[.toaster]:!text-blue-400",
        },
      }}
      icons={{
        success: <CircleCheckIcon className="size-5" />,
        info: <InfoIcon className="size-5" />,
        warning: <TriangleAlertIcon className="size-5" />,
        error: <OctagonXIcon className="size-5" />,
        loading: <Loader2Icon className="size-5 animate-spin" />,
      }}
      {...props}
    />
  )
}

export { Toaster }
