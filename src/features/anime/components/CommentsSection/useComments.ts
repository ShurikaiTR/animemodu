import { useCallback } from "react";

import { getCommentsAction } from "@/features/comments/actions/comment-actions";
import { getReviewsAction } from "@/features/reviews/actions/review-actions";

import type { Comment, Review } from "./types";

interface UseCommentsReturn {
    fetchComments: () => Promise<{
        comments: Comment[];
        reviews: Review[];
        totalCount: number;
    }>;
    fetchCounts: () => Promise<{ comments: number; reviews: number }>;
}

export function useComments(animeId: string, episodeId: string | undefined, activeTab: "comments" | "reviews"): UseCommentsReturn {
    const fetchComments = useCallback(async () => {
        if (activeTab === "comments") {
            const result = await getCommentsAction(animeId, episodeId);
            if (result.success && 'data' in result && result.data) {
                return {
                    comments: result.data.comments,
                    reviews: [],
                    totalCount: result.data.totalCount
                };
            }
            return { comments: [], reviews: [], totalCount: 0 };
        } else {
            const result = await getReviewsAction(animeId);
            if (result.success && 'data' in result && result.data) {
                return {
                    comments: [],
                    reviews: result.data.reviews,
                    totalCount: result.data.totalCount
                };
            }
            return { comments: [], reviews: [], totalCount: 0 };
        }
    }, [animeId, episodeId, activeTab]);

    const fetchCounts = useCallback(async () => {
        const [commentsResult, reviewsResult] = await Promise.all([
            getCommentsAction(animeId, episodeId),
            getReviewsAction(animeId)
        ]);

        let commentsCount = 0;
        let reviewsCount = 0;

        if (commentsResult.success && 'data' in commentsResult && commentsResult.data) {
            commentsCount = commentsResult.data.totalCount;
        }

        if (reviewsResult.success && 'data' in reviewsResult && reviewsResult.data) {
            reviewsCount = reviewsResult.data.totalCount;
        }

        return {
            comments: commentsCount,
            reviews: reviewsCount
        };
    }, [animeId, episodeId]);

    return { fetchComments, fetchCounts };
}

export type { Comment, Reply, Review } from "./types";




















