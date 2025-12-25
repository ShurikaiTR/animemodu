"use client";

import { ArrowLeft } from "lucide-react";
import { Button } from "./button";

interface BackButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  text?: string;
  hideText?: boolean;
}

export function BackButton({
  className,
  text = "Büyüyü Geri Al",
  hideText = false,
  ...props
}: BackButtonProps) {
  return (
    <Button
      variant="glass"
      onClick={() => window.history.back()}
      className={className}
      {...props}
    >
      {!hideText && <span className="mr-2">{text}</span>}
      <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
    </Button>
  );
}
























