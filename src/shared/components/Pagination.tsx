"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { usePathname,useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/shared/components/button";
import { cn } from "@/shared/lib/utils";

interface PaginationProps {
    currentPage: number;
    totalPages?: number;
    /** For variant="minimal", calculate totalPages from these values */
    totalItems?: number;
    itemsPerPage?: number;
    /** "minimal" = prev/next only, "full" = page numbers with ellipsis */
    variant?: "minimal" | "full";
    /** Query parameter name for page number */
    pageParam?: string;
    /** Base URL for link-based pagination (full variant) */
    baseUrl?: string;
}

export function Pagination({
    currentPage,
    totalPages: propTotalPages,
    totalItems,
    itemsPerPage,
    variant = "minimal",
    pageParam = "page",
    baseUrl,
}: PaginationProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const pathname = usePathname();

    const totalPages = propTotalPages ?? (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1);
    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        page === 1 ? params.delete(pageParam) : params.set(pageParam, page.toString());
        const queryString = params.toString();
        const base = baseUrl ?? pathname;
        return queryString ? `${base}?${queryString}` : base;
    };

    if (variant === "minimal") {
        return (
            <div className="flex items-center justify-center gap-4 py-4">
                <PaginationButton disabled={currentPage <= 1} onClick={() => router.push(createPageUrl(currentPage - 1))} icon={<ChevronLeft className="h-5 w-5" />} label="Önceki" />
                <span className="text-sm text-text-main/60 tabular-nums">
                    <span className="font-medium text-white">{currentPage}</span> / <span>{totalPages}</span>
                </span>
                <PaginationButton disabled={currentPage >= totalPages} onClick={() => router.push(createPageUrl(currentPage + 1))} icon={<ChevronRight className="h-5 w-5" />} label="Sonraki" />
            </div>
        );
    }

    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            <PaginationLink href={createPageUrl(currentPage - 1)} disabled={currentPage <= 1} icon={<ChevronLeft className="w-4 h-4" />} label="Önceki" />
            <div className="flex items-center gap-1">
                {getPageNumbers(currentPage, totalPages).map((page, i) => (
                    page === "..." ? <span key={`e-${i}`} className="px-3 py-2 text-text-main/50">...</span> :
                        <Link key={page} href={createPageUrl(page)} className={cn("min-w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors", currentPage === page ? "bg-primary text-white" : "bg-bg-secondary text-text-main hover:bg-white/10")}>{page}</Link>
                ))}
            </div>
            <PaginationLink href={createPageUrl(currentPage + 1)} disabled={currentPage >= totalPages} icon={<ChevronRight className="w-4 h-4" />} label="Sonraki" reverse />
        </div>
    );
}

function PaginationButton({ disabled, onClick, icon, label }: { disabled: boolean; onClick: () => void; icon: React.ReactNode; label: string }) {
    return (
        <Button variant="ghost" size="icon" disabled={disabled} onClick={onClick} className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors">
            <span className="sr-only">{label}</span>
            {icon}
        </Button>
    );
}

function PaginationLink({ href, disabled, icon, label, reverse }: { href: string; disabled: boolean; icon: React.ReactNode; label: string; reverse?: boolean }) {
    if (disabled) return <span className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary/50 text-text-main/30 cursor-not-allowed">{!reverse && icon}{label}{reverse && icon}</span>;
    return <Link href={href} className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary text-text-main hover:bg-white/10 transition-colors">{!reverse && icon}{label}{reverse && icon}</Link>;
}

function getPageNumbers(currentPage: number, totalPages: number) {
    const pages: (number | "...")[] = [];
    const showAround = 2;
    for (let i = 1; i <= totalPages; i++) {
        if (i === 1 || i === totalPages || (i >= currentPage - showAround && i <= currentPage + showAround)) {
            pages.push(i);
        } else if (pages[pages.length - 1] !== "...") {
            pages.push("...");
        }
    }
    return pages;
}

export default Pagination;
