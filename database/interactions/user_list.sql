-- User Anime List (Watch List) table
CREATE TABLE IF NOT EXISTS public.user_anime_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    anime_id BIGINT NOT NULL REFERENCES public.animes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped')),
    score INTEGER CHECK (score >= 0 AND score <= 10),
    created_at TIMESTAMPTZ DEFAULT now(),
    updated_at TIMESTAMPTZ DEFAULT now(),
    UNIQUE(user_id, anime_id)
);

-- RLS Policies
ALTER TABLE public.user_anime_list ENABLE ROW LEVEL SECURITY;

-- Select: Everyone can view anime lists (for public profiles)
CREATE POLICY "Everyone can view anime lists" ON public.user_anime_list
    FOR SELECT USING (true);

-- Insert: Users can add to their own list
CREATE POLICY "Users can add to their own list" ON public.user_anime_list
    FOR INSERT WITH CHECK ((select auth.uid()) = user_id);

-- Update: Users can update their own list
CREATE POLICY "Users can update their own list" ON public.user_anime_list
    FOR UPDATE USING ((select auth.uid()) = user_id);

-- Delete: Users can delete from their own list
CREATE POLICY "Users can delete from their own list" ON public.user_anime_list
    FOR DELETE USING ((select auth.uid()) = user_id);

-- Indices
CREATE INDEX idx_user_anime_list_user_id ON public.user_anime_list(user_id);
CREATE INDEX idx_user_anime_list_anime_id ON public.user_anime_list(anime_id);
CREATE INDEX idx_user_anime_list_status ON public.user_anime_list(status);

-- Trigger for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql'
set search_path = public;

CREATE TRIGGER update_user_anime_list_updated_at
    BEFORE UPDATE ON public.user_anime_list
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
