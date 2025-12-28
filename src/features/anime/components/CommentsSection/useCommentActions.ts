"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { createClient } from "@/shared/lib/supabase/client";
import { toggleCommentLike, checkUserLikedComment } from "./likesService";
import type { User } from "@supabase/supabase-js";

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

    useEffect(() => {
        if (user) {
            checkUserLikedComment(commentId, user.id).then(setLiked);
        }
    }, [user, commentId]);

    const handleLike = async () => {
        if (!user) {
            toast.error("Beğenmek için giriş yapmalısınız");
            return;
        }
        if (isLiking) return;

        setIsLiking(true);
        const { liked: newLiked, error } = await toggleCommentLike(commentId, user);
        setIsLiking(false);

        if (error) {
            toast.error(error);
            return;
        }

        setLiked(newLiked);
        setLikeCount(prev => newLiked ? prev + 1 : prev - 1);
    };

    const handlePin = async () => {
        const supabase = createClient();
        const newPinned = !isPinned;
        const { error } = await supabase.from("comments").update({ is_pinned: newPinned }).eq("id", commentId);
        if (error) return toast.error("Sabitleme işlemi başarısız");
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
