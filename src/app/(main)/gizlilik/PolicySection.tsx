import { ChevronDown, LucideIcon } from "lucide-react";

interface PolicySectionProps {
    title: string;
    icon: LucideIcon;
    children: React.ReactNode;
    defaultOpen?: boolean;
}

export default function PolicySection({
    title,
    icon: Icon,
    children,
    defaultOpen = false,
}: PolicySectionProps) {
    return (
        <details
            className="group flex flex-col rounded-2xl border border-white/10 bg-white/5 backdrop-blur-sm overflow-hidden transition-all duration-300 open:pb-6"
            open={defaultOpen}
        >
            <summary className="flex cursor-pointer items-center justify-between gap-6 p-5 md:p-6 select-none hover:bg-white/[0.07] transition-colors list-none [&::-webkit-details-marker]:hidden">
                <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center size-10 rounded-xl bg-primary/10 text-primary border border-primary/20">
                        <Icon className="w-5 h-5" />
                    </div>
                    <p className="text-text-main text-lg font-bold leading-normal">
                        {title}
                    </p>
                </div>
                <ChevronDown className="w-5 h-5 text-text-main/30 group-open:rotate-180 transition-transform duration-300" />
            </summary>
            <div className="px-6 md:px-20 pt-2 text-text-main/70 text-base font-normal leading-relaxed">
                {children}
            </div>
        </details>
    );
}
