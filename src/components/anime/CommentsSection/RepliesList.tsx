"use client";

import ReplyItem from "./ReplyItem";
import type { Reply } from "./types";

interface RepliesListProps {
    replies: Reply[];
    parentId: string;
    animeId: string;
    episodeId?: string;
    onReplyAdded: () => void;
}

export default function RepliesList({ replies, parentId, animeId, episodeId, onReplyAdded }: RepliesListProps) {
    if (!replies || replies.length === 0) return null;

    return (
        <div className="relative ml-6">
            <div className="absolute left-0 top-0 bottom-4 w-px bg-gradient-to-b from-primary/30 to-transparent" />

            {replies.map((reply, index) => (
                <ReplyItem
                    key={reply.id}
                    reply={reply}
                    parentId={parentId}
                    animeId={animeId}
                    episodeId={episodeId}
                    onReplyAdded={onReplyAdded}
                    isLast={index === replies.length - 1}
                />
            ))}
        </div>
    );
}
