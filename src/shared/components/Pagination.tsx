"use client";

import Link from "next/link";
import { useSearchParams, useRouter, usePathname } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";
import { Button } from "@/shared/components/button";

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

    // Calculate totalPages from totalItems and itemsPerPage if not provided
    const totalPages = propTotalPages ?? (totalItems && itemsPerPage ? Math.ceil(totalItems / itemsPerPage) : 1);

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete(pageParam);
        } else {
            params.set(pageParam, page.toString());
        }
        const queryString = params.toString();
        const base = baseUrl ?? pathname;
        return queryString ? `${base}?${queryString}` : base;
    };

    const handlePageChange = (page: number) => {
        router.push(createPageUrl(page));
    };

    // Generate page numbers to show (for full variant)
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        const showAround = 2;

        for (let i = 1; i <= totalPages; i++) {
            if (
                i === 1 ||
                i === totalPages ||
                (i >= currentPage - showAround && i <= currentPage + showAround)
            ) {
                pages.push(i);
            } else if (pages[pages.length - 1] !== "...") {
                pages.push("...");
            }
        }
        return pages;
    };

    if (variant === "minimal") {
        return (
            <div className="flex items-center justify-center gap-4 py-4">
                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage <= 1}
                    onClick={() => handlePageChange(currentPage - 1)}
                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <span className="sr-only">Önceki</span>
                    <ChevronLeft className="h-5 w-5" />
                </Button>

                <span className="text-sm text-text-main/60 tabular-nums">
                    <span className="font-medium text-white">{currentPage}</span>
                    <span className="mx-1">/</span>
                    <span>{totalPages}</span>
                </span>

                <Button
                    variant="ghost"
                    size="icon"
                    disabled={currentPage >= totalPages}
                    onClick={() => handlePageChange(currentPage + 1)}
                    className="h-10 w-10 rounded-xl border border-white/10 bg-white/5 text-white/60 hover:bg-white/10 hover:text-white disabled:opacity-30 transition-colors"
                >
                    <span className="sr-only">Sonraki</span>
                    <ChevronRight className="h-5 w-5" />
                </Button>
            </div>
        );
    }

    // Full variant with page numbers
    return (
        <div className="flex items-center justify-center gap-2 mt-12">
            {/* Previous */}
            {currentPage > 1 ? (
                <Link
                    href={createPageUrl(currentPage - 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary text-text-main hover:bg-white/10 transition-colors"
                >
                    <ChevronLeft className="w-4 h-4" />
                    Önceki
                </Link>
            ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary/50 text-text-main/30 cursor-not-allowed">
                    <ChevronLeft className="w-4 h-4" />
                    Önceki
                </span>
            )}

            {/* Page Numbers */}
            <div className="flex items-center gap-1">
                {getPageNumbers().map((page, index) =>
                    page === "..." ? (
                        <span key={`ellipsis-${index}`} className="px-3 py-2 text-text-main/50">
                            ...
                        </span>
                    ) : (
                        <Link
                            key={page}
                            href={createPageUrl(page)}
                            className={cn(
                                "min-w-10 h-10 flex items-center justify-center rounded-xl font-medium transition-colors",
                                currentPage === page
                                    ? "bg-primary text-white"
                                    : "bg-bg-secondary text-text-main hover:bg-white/10"
                            )}
                        >
                            {page}
                        </Link>
                    )
                )}
            </div>

            {/* Next */}
            {currentPage < totalPages ? (
                <Link
                    href={createPageUrl(currentPage + 1)}
                    className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary text-text-main hover:bg-white/10 transition-colors"
                >
                    Sonraki
                    <ChevronRight className="w-4 h-4" />
                </Link>
            ) : (
                <span className="flex items-center gap-1 px-4 py-2 rounded-xl bg-bg-secondary/50 text-text-main/30 cursor-not-allowed">
                    Sonraki
                    <ChevronRight className="w-4 h-4" />
                </span>
            )}
        </div>
    );
}

export default Pagination;
