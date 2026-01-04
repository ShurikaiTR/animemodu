"use client";

import { useEffect, useState } from "react";

import { useAuth } from "@/shared/contexts/AuthContext";

import CommentInput from "./CommentInput";
import CommentItem from "./CommentItem";
import CommentsHeader from "./CommentsHeader";
import { EmptyComments, EmptyReviews, SkeletonCard } from "./Placeholders";
import ReviewCard from "./ReviewCard";
import type { Comment, Review } from "./types";
import { useComments } from "./useComments";

interface CommentsSectionProps {
    animeId: string;
    episodeId?: string;
}

export default function CommentsSection({ animeId, episodeId }: CommentsSectionProps) {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<"comments" | "reviews">("comments");
    const [showSpoiler, setShowSpoiler] = useState<Record<string, boolean>>({});
    const [comments, setComments] = useState<Comment[]>([]);
    const [reviews, setReviews] = useState<Review[]>([]);
    const [counts, setCounts] = useState({ comments: 0, reviews: 0 });
    const [isLoading, setIsLoading] = useState(false);

    const { fetchComments, fetchCounts } = useComments(animeId, episodeId, activeTab);

    const refreshData = async () => {
        setIsLoading(true);
        try {
            const { comments, reviews, totalCount } = await fetchComments();
            setComments(comments);
            setReviews(reviews);
            setCounts(prev => ({ ...prev, [activeTab]: totalCount }));
            return { comments, reviews, totalCount };
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (!animeId) return;
        fetchCounts().then(setCounts);
    }, [animeId, episodeId]);

    useEffect(() => {
        if (!animeId) return;
        refreshData();
    }, [animeId, episodeId, activeTab]);

    return (
        <div className="mt-20 max-w-5xl px-4 md:px-0">
            {/* Comments/Reviews Tabs */}
            <div className="mb-10">
                <CommentsHeader
                    activeTab={activeTab}
                    onTabChange={(tab) => { if (!episodeId || tab !== "reviews") setActiveTab(tab); }}
                    commentCount={counts.comments}
                    reviewCount={counts.reviews}
                    showReviews={!episodeId}
                />
            </div>

            <div className="relative">
                <CommentInput activeTab={activeTab} animeId={animeId} episodeId={episodeId} onCommentAdded={refreshData} />

                <div className="space-y-4">
                    {isLoading ? (
                        <>
                            <SkeletonCard />
                            <SkeletonCard />
                            <SkeletonCard />
                        </>
                    ) : activeTab === "comments" ? (
                        comments.length > 0 ? (
                            [...comments].sort((a, b) => (b.isPinned ? 1 : 0) - (a.isPinned ? 1 : 0)).map((comment) => (
                                <CommentItem
                                    key={comment.id}
                                    comment={comment}
                                    showSpoiler={showSpoiler}
                                    onToggleSpoiler={(id: string) => setShowSpoiler(prev => ({ ...prev, [id]: !prev[id] }))}
                                    animeId={animeId}
                                    episodeId={episodeId}
                                    onReplyAdded={refreshData}
                                />
                            ))
                        ) : user ? <EmptyComments /> : null
                    ) : (
                        reviews.length > 0 ? reviews.map(review => <ReviewCard key={review.id} review={review} />) : user ? <EmptyReviews /> : null
                    )}
                </div>
            </div>
        </div>
    );
}
