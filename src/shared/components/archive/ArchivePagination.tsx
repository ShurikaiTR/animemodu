"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/shared/lib/utils";

interface ArchivePaginationProps {
    currentPage: number;
    totalPages: number;
    baseUrl?: string;
}

export default function ArchivePagination({ currentPage, totalPages, baseUrl = "/arsiv" }: ArchivePaginationProps) {
    const searchParams = useSearchParams();

    if (totalPages <= 1) return null;

    const createPageUrl = (page: number) => {
        const params = new URLSearchParams(searchParams.toString());
        if (page === 1) {
            params.delete("sayfa");
        } else {
            params.set("sayfa", page.toString());
        }
        const queryString = params.toString();
        return queryString ? `${baseUrl}?${queryString}` : baseUrl;
    };

    // Generate page numbers to show
    const getPageNumbers = () => {
        const pages: (number | "...")[] = [];
        const showAround = 2; // Pages to show around current

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
                                "min-w-[40px] h-10 flex items-center justify-center rounded-xl font-medium transition-colors",
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
