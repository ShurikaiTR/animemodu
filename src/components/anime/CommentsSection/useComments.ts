import { useCallback } from "react";
import { fetchCommentsData } from "./useComments/fetchComments";
import { fetchReviewsData } from "./useComments/fetchReviews";
import type { Comment, Review } from "./types";

interface UseCommentsReturn {
    fetchComments: () => Promise<{
        comments: Comment[];
        reviews: Review[];
        totalCount: number;
    }>;
    fetchCounts: () => Promise<{ comments: number; reviews: number }>;
}

export function useComments(animeId: number, episodeId: number | undefined, activeTab: "comments" | "reviews"): UseCommentsReturn {
    const fetchComments = useCallback(async () => {
        if (activeTab === "comments") {
            const { comments, totalCount } = await fetchCommentsData(animeId, episodeId);
            return {
                comments,
                reviews: [],
                totalCount
            };
        } else {
            const { reviews, totalCount } = await fetchReviewsData(animeId);
            return {
                comments: [],
                reviews,
                totalCount
            };
        }
    }, [animeId, episodeId, activeTab]);

    const fetchCounts = useCallback(async () => {
        const [commentsResult, reviewsResult] = await Promise.all([
            fetchCommentsData(animeId, episodeId),
            fetchReviewsData(animeId)
        ]);
        return {
            comments: commentsResult.totalCount,
            reviews: reviewsResult.totalCount
        };
    }, [animeId, episodeId]);

    return { fetchComments, fetchCounts };
}

export type { Comment, Reply, Review } from "./types";


















