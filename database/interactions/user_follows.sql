-- =====================================================
-- User Follows Table
-- Kullanıcı takip ilişkilerini tutan tablo
-- =====================================================

CREATE TABLE IF NOT EXISTS public.user_follows (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    follower_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    following_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL,
    
    -- Aynı kişiyi birden fazla takip edemez
    CONSTRAINT unique_follow UNIQUE(follower_id, following_id),
    -- Kendini takip edemez
    CONSTRAINT no_self_follow CHECK (follower_id != following_id)
);

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE public.user_follows ENABLE ROW LEVEL SECURITY;

-- Select: Herkes görebilir (public profiller için)
CREATE POLICY "Everyone can view follows" ON public.user_follows
    FOR SELECT USING (true);

-- Insert: Kullanıcılar sadece kendi takiplerini ekleyebilir
CREATE POLICY "Users can follow others" ON public.user_follows
    FOR INSERT WITH CHECK ((select auth.uid()) = follower_id);

-- Delete: Kullanıcılar sadece kendi takiplerini silebilir
CREATE POLICY "Users can unfollow" ON public.user_follows
    FOR DELETE USING ((select auth.uid()) = follower_id);

-- =====================================================
-- Indexes
-- =====================================================

-- Takipçi sayısı sorguları için (following_id bazlı)
CREATE INDEX IF NOT EXISTS idx_user_follows_following_id 
    ON public.user_follows(following_id);

-- Takip edilen sayısı sorguları için (follower_id bazlı)
CREATE INDEX IF NOT EXISTS idx_user_follows_follower_id 
    ON public.user_follows(follower_id);

-- Takip durumu kontrolü için composite index
CREATE INDEX IF NOT EXISTS idx_user_follows_check 
    ON public.user_follows(follower_id, following_id);
