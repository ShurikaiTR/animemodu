"use client";

import { cn } from "@/shared/lib/utils";

interface CommentsHeaderProps {
    activeTab: "comments" | "reviews";
    onTabChange: (tab: "comments" | "reviews") => void;
    commentCount: number;
    reviewCount: number;
    showReviews: boolean;
}

export default function CommentsHeader({ activeTab, onTabChange, commentCount, reviewCount, showReviews }: CommentsHeaderProps) {
    return (
        <ul className="flex flex-row items-start gap-5 md:gap-8">
            <li>
                <TabButton
                    isActive={activeTab === "comments"}
                    onClick={() => onTabChange("comments")}
                    label="Yorumlar"
                    count={commentCount}
                />
            </li>

            {showReviews && (
                <li>
                    <TabButton
                        isActive={activeTab === "reviews"}
                        onClick={() => onTabChange("reviews")}
                        label="İncelemeler"
                        count={reviewCount}
                    />
                </li>
            )}
        </ul>
    );
}

interface TabButtonProps {
    isActive: boolean;
    onClick: () => void;
    label: string;
    count: number;
}

function TabButton({ isActive, onClick, label, count }: TabButtonProps) {
    return (
        <button
            onClick={onClick}
            className={cn(
                "flex items-start gap-2.5 transition-opacity duration-300",
                isActive ? "opacity-100" : "opacity-50 hover:opacity-100"
            )}
        >
            <h4 className="text-white font-normal text-xl md:text-2xl leading-none">
                {label}
            </h4>
            <span className="flex items-center justify-center min-w-5 h-5 px-1.5 rounded-md bg-primary text-xs text-white/80 font-normal">
                {count}
            </span>
        </button>
    );
}
