-- User Anime List (Watch List) table
CREATE TABLE IF NOT EXISTS public.user_anime_list (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    anime_id UUID NOT NULL REFERENCES public.animes(id) ON DELETE CASCADE,
    status TEXT NOT NULL CHECK (status IN ('watching', 'completed', 'plan_to_watch', 'on_hold', 'dropped')),
    score INTEGER CHECK (score >= 0 AND score <= 10),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
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
create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql
set search_path = public;

drop trigger if exists set_user_anime_list_updated_at on public.user_anime_list;
create trigger set_user_anime_list_updated_at
    before update on public.user_anime_list
    for each row
    execute function public.handle_updated_at();
