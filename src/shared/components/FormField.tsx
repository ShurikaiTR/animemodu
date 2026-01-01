"use client";

import { ReactNode } from "react";
import { cn } from "@/shared/lib/utils";
import { Label } from "@/shared/components/label";

interface FormFieldProps {
    /** Label text for the field */
    label: string;
    /** HTML id for the input (also used for label's htmlFor) */
    id: string;
    /** Icon to display on the left side of the input */
    icon: ReactNode;
    /** The input element(s) */
    children: ReactNode;
    /** Extra content to show on the right side of the label (e.g., character count) */
    extraLabelContent?: ReactNode;
    /** Additional class for the container */
    className?: string;
    /** Icon alignment - "center" for single-line inputs, "top" for textareas */
    iconAlign?: "center" | "top";
    /** Optional helper text below the field */
    helperText?: string;
}

/**
 * Form field wrapper for panel forms with consistent styling
 * @example
 * <FormField
 *   id="title"
 *   label="Başlık"
 *   icon={<Type className="w-5 h-5" />}
 * >
 *   <Input id="title" name="title" variant="panel" placeholder="Anime başlığı..." />
 * </FormField>
 */
export function FormField({
    label,
    id,
    icon,
    children,
    extraLabelContent,
    className,
    iconAlign = "center",
    helperText,
}: FormFieldProps) {
    return (
        <div className={cn("space-y-2.5", className)}>
            <div className="flex items-center justify-between">
                <Label variant="panel" htmlFor={id}>
                    {label}
                </Label>
                {extraLabelContent}
            </div>
            <div className="relative group">
                <div
                    className={cn(
                        "absolute left-3.5 pointer-events-none transition-colors group-focus-within:text-primary text-text-main/30",
                        iconAlign === "center" ? "inset-y-0 flex items-center" : "top-4"
                    )}
                >
                    {icon}
                </div>
                {children}
            </div>
            {helperText && (
                <p className="font-inter text-xs font-medium text-text-main/20 pl-1">
                    {helperText}
                </p>
            )}
        </div>
    );
}
