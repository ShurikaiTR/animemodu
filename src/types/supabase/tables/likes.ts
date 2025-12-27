export interface CommentLikesTable {
    Row: {
        id: string
        user_id: string
        comment_id: string
        created_at: string
    }
    Insert: {
        id?: string
        user_id: string
        comment_id: string
        created_at?: string
    }
    Update: {
        id?: string
        user_id?: string
        comment_id?: string
        created_at?: string
    }
    Relationships: [
        {
            foreignKeyName: "comment_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "comment_likes_comment_id_fkey"
            columns: ["comment_id"]
            isOneToOne: false
            referencedRelation: "comments"
            referencedColumns: ["id"]
        }
    ]
}

export interface ReviewLikesTable {
    Row: {
        id: string
        user_id: string
        review_id: string
        created_at: string
    }
    Insert: {
        id?: string
        user_id: string
        review_id: string
        created_at?: string
    }
    Update: {
        id?: string
        user_id?: string
        review_id?: string
        created_at?: string
    }
    Relationships: [
        {
            foreignKeyName: "review_likes_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
        },
        {
            foreignKeyName: "review_likes_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
        }
    ]
}
