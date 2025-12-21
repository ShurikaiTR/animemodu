
-- Reports Table
create table public.reports (
    id uuid not null default gen_random_uuid(),
    user_id uuid references public.profiles(id) on delete set null,
    anime_id bigint not null references public.animes(id) on delete cascade,
    anime_title text not null, -- Store title for easier display if anime is deleted (though cascade handles deletion, having title is useful for quick access) -> Actually foreign key exists, we can join. But let's just use anime_id. Wait, `ReportModal` has `animeTitle` prop.
    -- Let's stick to normalized data: anime_id.
    episode_number int,
    season_number int, -- Nullable for standard anime? Or 1 default.
    episode_title text, -- Optional, for context if needed.
    
    reason text not null check (reason in ('playback', 'audio', 'subtitle', 'wrong')),
    description text,
    status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
    
    created_at timestamptz not null default now(),
    updated_at timestamptz not null default now(),
    
    constraint reports_pkey primary key (id)
);

-- RLS Policies
alter table public.reports enable row level security;

-- Admins can view and update all reports
create policy "Admins can view all reports"
    on public.reports for select
    using ( public.is_admin() );

create policy "Admins can update reports"
    on public.reports for update
    using ( public.is_admin() );

create policy "Admins can delete reports"
    on public.reports for delete
    using ( public.is_admin() );

-- Users can insert reports (Authenticated or Anonymous? Let's allow Authenticated for now. Anonymous requires public insert)
-- "public.is_admin()" check or "auth.uid() is not null"?
-- Let's allow any authenticated user to insert.
create policy "Users can create reports"
    on public.reports for insert
    with check ( auth.role() = 'authenticated' );

-- If we want anonymous reports, we'd need public insert. Let's start with authenticated.
-- Actually, user might not be logged in while watching? 
-- The user request implies `user_id` is nullable. 
-- Let's allow public insert for now but `user_id` will be null if not logged in.
create policy "Anyone can create reports"
    on public.reports for insert
    with check ( true ); 

-- Indexes
create index reports_anime_id_idx on public.reports(anime_id);
create index reports_status_idx on public.reports(status);
create index reports_created_at_idx on public.reports(created_at desc);

-- Trigger for updated_at
create trigger handle_reports_updated_at
    before update on public.reports
    for each row
    execute function public.handle_updated_at();
