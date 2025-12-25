import { cn } from "@/lib/utils";

interface MobileMenuButtonProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
}

export default function MobileMenuButton({ isOpen, setIsOpen }: MobileMenuButtonProps) {
    return (
        <button
            className={cn("relative block w-6 h-6 group z-40 xl:hidden", isOpen && "active")}
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            aria-label={isOpen ? "Menüyü kapat" : "Menüyü aç"}
            aria-expanded={isOpen}
        >
            <span className={cn(
                "absolute left-0 top-0 w-6 h-0.5 bg-white rounded-sm transition-all duration-500",
                isOpen && "bg-primary rotate-45 top-2.5"
            )} />
            <span className={cn(
                "absolute left-0 top-2.5 w-4 h-0.5 bg-white rounded-sm transition-all duration-500",
                isOpen && "opacity-0"
            )} />
            <span className={cn(
                "absolute left-0 top-5 w-2 h-0.5 bg-white rounded-sm transition-all duration-500",
                isOpen && "bg-primary w-6 -rotate-45 top-2.5"
            )} />
        </button>
    );
}









