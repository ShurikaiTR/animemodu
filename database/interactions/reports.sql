-- =====================================================
-- REPORTS TABLE
-- Video/içerik hata bildirimleri için
-- =====================================================

create table if not exists public.reports (
    id bigint primary key generated always as identity,
    
    -- İlişkili anime ve bölüm bilgileri
    anime_id bigint not null references public.animes(id) on delete cascade,
    anime_title text not null,  -- Denormalized, anime silinse bile görüntüleme için
    episode_id bigint references public.episodes(id) on delete set null,
    season_number integer,
    episode_number integer,
    
    -- Bildirim detayları
    reason text not null check (reason in ('playback', 'audio', 'subtitle', 'wrong')),
    description text,
    status text not null default 'pending' check (status in ('pending', 'resolved', 'dismissed')),
    
    -- Kullanıcı (anonim bildirimlere izin ver)
    user_id uuid references auth.users(id) on delete set null,
    
    -- Timestamps
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- =====================================================
-- ROW LEVEL SECURITY
-- =====================================================

alter table public.reports enable row level security;

-- Herkes rapor oluşturabilir (giriş yapmış veya anonim)
create policy "Anyone can create reports"
    on public.reports for insert
    with check (true);

-- Sadece adminler raporları görebilir
create policy "Only admins can view reports"
    on public.reports for select
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
    );

-- Sadece adminler raporları güncelleyebilir
create policy "Only admins can update reports"
    on public.reports for update
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
    );

-- Sadece adminler raporları silebilir
create policy "Only admins can delete reports"
    on public.reports for delete
    using (
        exists (
            select 1 from public.profiles
            where profiles.id = (select auth.uid())
            and profiles.role = 'admin'
        )
    );

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_reports_anime_id on public.reports(anime_id);
create index if not exists idx_reports_status on public.reports(status);
create index if not exists idx_reports_created_at on public.reports(created_at desc);
create index if not exists idx_reports_user_id on public.reports(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated at trigger
create or replace function public.handle_reports_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql
set search_path = public;

drop trigger if exists set_reports_updated_at on public.reports;
create trigger set_reports_updated_at
    before update on public.reports
    for each row
    execute function public.handle_reports_updated_at();

-- =====================================================
-- COMMENTS
-- =====================================================
comment on table public.reports is 'Video/içerik hata bildirimleri';
comment on column public.reports.reason is 'playback: video açılmıyor, audio: ses sorunu, subtitle: altyazı hatalı, wrong: yanlış bölüm';
comment on column public.reports.status is 'pending: beklemede, resolved: çözüldü, dismissed: reddedildi';
