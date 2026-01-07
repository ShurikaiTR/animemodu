-- =====================================================
-- Notifications Table
-- Kullanıcı bildirimlerini yöneten tablo
-- =====================================================

CREATE TABLE IF NOT EXISTS public.notifications (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    type TEXT NOT NULL CHECK (type IN (
        'new_episode',     -- Listendeki animede yeni bölüm
        'comment_reply',   -- Yorumuna yanıt
        'new_follower',    -- Yeni takipçi
        'review_like',     -- İnceleme beğenisi
        'comment_like'     -- Yorum beğenisi
    )),
    title TEXT NOT NULL,
    message TEXT,
    link TEXT,
    is_read BOOLEAN DEFAULT FALSE NOT NULL,
    -- İlişkili entity'ler (opsiyonel)
    anime_id UUID REFERENCES public.animes(id) ON DELETE CASCADE,
    episode_id UUID REFERENCES public.episodes(id) ON DELETE SET NULL,
    actor_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
    created_at TIMESTAMPTZ DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- =====================================================
-- RLS Policies
-- =====================================================

ALTER TABLE public.notifications ENABLE ROW LEVEL SECURITY;

-- Select: Kullanıcılar sadece kendi bildirimlerini görebilir
CREATE POLICY "Users can view their own notifications" ON public.notifications
    FOR SELECT USING ((select auth.uid()) = user_id);

-- Insert: Sistem veya auth kullanıcılar bildirim ekleyebilir
CREATE POLICY "System can insert notifications" ON public.notifications
    FOR INSERT WITH CHECK (true);

-- Update: Kullanıcılar sadece kendi bildirimlerini güncelleyebilir (okundu işaretleme)
CREATE POLICY "Users can update their own notifications" ON public.notifications
    FOR UPDATE USING ((select auth.uid()) = user_id)
    WITH CHECK ((select auth.uid()) = user_id);

-- Delete: Kullanıcılar sadece kendi bildirimlerini silebilir
CREATE POLICY "Users can delete their own notifications" ON public.notifications
    FOR DELETE USING ((select auth.uid()) = user_id);

-- =====================================================
-- Indexes
-- =====================================================

-- Kullanıcı bazlı listeleme
CREATE INDEX IF NOT EXISTS idx_notifications_user_id 
    ON public.notifications(user_id);

-- Kullanıcı + okunmamış (en kritik sorgu)
CREATE INDEX IF NOT EXISTS idx_notifications_user_unread 
    ON public.notifications(user_id, is_read) 
    WHERE is_read = FALSE;

-- Kullanıcı + tarih sıralaması
CREATE INDEX IF NOT EXISTS idx_notifications_user_created 
    ON public.notifications(user_id, created_at DESC);

-- Anime bazlı sorgular
CREATE INDEX IF NOT EXISTS idx_notifications_anime_id 
    ON public.notifications(anime_id);
