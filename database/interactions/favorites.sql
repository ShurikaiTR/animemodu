-- User Favorites table
CREATE TABLE IF NOT EXISTS public.user_favorites (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    anime_id BIGINT NOT NULL REFERENCES public.animes(id) ON DELETE CASCADE,
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, anime_id)
);

-- RLS Policies
ALTER TABLE public.user_favorites ENABLE ROW LEVEL SECURITY;

-- Select: Users can view their own favorites, and everyone can view public profiles' favorites (handled by checking user_id usually, but let's make it open or restricted efficiently. Usually "Users can view their own" + "Public access if profile is public" but simplest is: Authentication required for modification, Select is usually open or owned)
-- Actually, for now let's mimic user_list policies but check if we need public access.
-- Based on the codebase, we fetch favorites for public profiles too.
CREATE POLICY "Everyone can view favorites" ON public.user_favorites
    FOR SELECT USING (true);

-- Insert: Users can add to their own favorites
CREATE POLICY "Users can add to their own favorites" ON public.user_favorites
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Delete: Users can delete from their own favorites
CREATE POLICY "Users can delete from their own favorites" ON public.user_favorites
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Indices
CREATE INDEX idx_user_favorites_user_id ON public.user_favorites(user_id);
CREATE INDEX idx_user_favorites_anime_id ON public.user_favorites(anime_id);
