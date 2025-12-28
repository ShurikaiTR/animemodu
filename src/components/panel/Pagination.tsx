"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/shared/components/button";
import { useRouter, useSearchParams, usePathname } from "next/navigation";

interface PaginationProps {
    totalItems: number;
    itemsPerPage: number;
    currentPage: number;
}

export function Pagination({ totalItems, itemsPerPage, currentPage }: PaginationProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const createPageURL = (pageNumber: number) => {
        const params = new URLSearchParams(searchParams);
        params.set("page", pageNumber.toString());
        return `${pathname}?${params.toString()}`;
    };

    const handlePageChange = (page: number) => {
        router.push(createPageURL(page));
    };

    if (totalPages <= 1) return null;

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
