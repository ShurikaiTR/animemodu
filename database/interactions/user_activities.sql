-- =====================================================
-- User Activities Table
-- Kullanıcı aktivitelerini takip eden tablo
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_type TEXT NOT NULL CHECK (activity_type IN (
        'watchlist_add',      -- Listeye ekleme
        'watchlist_update',   -- Durum değiştirme
        'watchlist_remove',   -- Listeden çıkarma
        'favorite_add',       -- Favorilere ekleme
        'favorite_remove',    -- Favorilerden çıkarma
        'comment_add',        -- Yorum yapma
        'review_add',         -- İnceleme yazma (puan dahil)
        'profile_update',     -- Profil güncelleme (metadata: changed_fields)
        'follow_add',         -- Kullanıcı takip etme (metadata: target_user_id, target_username)
        'follow_remove',      -- Kullanıcı takipten çıkarma
        'followed_by'         -- Biri tarafından takip edilme (metadata: follower_user_id, follower_username)
    )),
    anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
    -- Metadata örnekleri:
    -- watchlist: { "status": "watching", "anime_title": "..." }
    -- profile_update: { "changed_fields": ["avatar", "bio", "location"] }
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE public.user_activities ENABLE ROW LEVEL SECURITY;

-- Select: Herkes görebilir (public profiller için)
CREATE POLICY "Everyone can view activities" ON public.user_activities
    FOR SELECT USING (true);

-- Insert: Kullanıcılar sadece kendi aktivitelerini ekleyebilir
CREATE POLICY "Users can add their own activities" ON public.user_activities
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Delete: Kullanıcılar veya adminler silebilir
CREATE POLICY "Users or admins can delete activities" ON public.user_activities
    FOR DELETE USING (
        (select auth.uid()) = user_id
        OR EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = (select auth.uid())
            AND profiles.role = 'admin'
        )
    );

-- =====================================================
-- Indexes
-- =====================================================

-- Kullanıcı profili sorguları için
CREATE INDEX IF NOT EXISTS idx_user_activities_user_id 
    ON public.user_activities(user_id);

-- Son aktiviteler sıralaması için
CREATE INDEX IF NOT EXISTS idx_user_activities_created_at 
    ON public.user_activities(created_at DESC);

-- Composite index - profil sayfası (en kritik sorgu)
CREATE INDEX IF NOT EXISTS idx_user_activities_user_created 
    ON public.user_activities(user_id, created_at DESC);

-- Tip bazlı filtreleme için
CREATE INDEX IF NOT EXISTS idx_user_activities_type 
    ON public.user_activities(activity_type);

-- Anime bazlı sorgular için
CREATE INDEX IF NOT EXISTS idx_user_activities_anime_id 
    ON public.user_activities(anime_id);
