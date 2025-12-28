import type { LucideIcon } from "lucide-react";
import { Inbox } from "lucide-react";

interface EmptyStateProps {
    /** Icon to display */
    icon?: LucideIcon;
    /** Main title */
    title: string;
    /** Description text */
    description?: string;
    /** Additional className for container */
    className?: string;
    /** Children for custom actions */
    children?: React.ReactNode;
}

/**
 * Reusable empty state component for displaying when there's no content
 * @example
 * <EmptyState
 *   icon={Film}
 *   title="Henüz Film Eklenmemiş"
 *   description="Şu anda görüntülenecek film bulunmuyor."
 * />
 */
export default function EmptyState({
    icon: Icon = Inbox,
    title,
    description,
    className = "",
    children,
}: EmptyStateProps) {
    return (
        <div className={`col-span-full py-20 text-center ${className}`}>
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-white/5 mb-6">
                <Icon className="w-10 h-10 text-white/20" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">{title}</h3>
            {description && (
                <p className="text-white/40 max-w-md mx-auto mb-4">
                    {description}
                </p>
            )}
            {children}
        </div>
    );
}

