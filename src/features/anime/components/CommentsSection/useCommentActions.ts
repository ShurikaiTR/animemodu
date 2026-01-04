"use client";

import type { User } from "@supabase/supabase-js";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";

import { checkUserLikedCommentAction, toggleCommentLikeAction, toggleCommentPinAction } from "@/features/comments/actions/comment-actions";

interface UseCommentActionsProps {
    commentId: string;
    initialLikes: number;
    initialPinned: boolean;
    user: User | null;
}

export function useCommentActions({ commentId, initialLikes, initialPinned, user }: UseCommentActionsProps) {
    const [liked, setLiked] = useState(false);
    const [likeCount, setLikeCount] = useState(initialLikes);
    const [isLiking, setIsLiking] = useState(false);
    const [isPinned, setIsPinned] = useState(initialPinned);

    const checkLiked = useCallback(async () => {
        if (!user) return;
        const result = await checkUserLikedCommentAction(commentId);
        if (result.success && 'data' in result) {
            setLiked(!!result.data);
        }
    }, [user, commentId]);

    useEffect(() => {
        checkLiked();
    }, [checkLiked]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Beğenmek için giriş yapmalısınız");
            return;
        }
        if (isLiking) return;

        setIsLiking(true);
        const result = await toggleCommentLikeAction(commentId);
        setIsLiking(false);

        if (!result.success) {
            toast.error(result.error);
            return;
        }

        const newLiked = (result.data as { liked: boolean }).liked;
        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    };

    const handlePin = async () => {
        const result = await toggleCommentPinAction(commentId);
        if (!result.success) {
            toast.error(result.error || "Sabitleme işlemi başarısız");
            return;
        }

        const newPinned = !!result.data;
        setIsPinned(newPinned);
        toast.success(newPinned ? "Yorum sabitlendi" : "Sabitleme kaldırıldı");
    };

    return {
        liked,
        likeCount,
        isLiking,
        isPinned,
        handleLike,
        handlePin
    };
}
