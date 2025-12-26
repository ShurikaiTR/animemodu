create table if not exists animes (
  id bigint primary key generated always as identity,
  tmdb_id integer unique not null,
  anilist_id integer,
  title text not null,
  original_title text,
  overview text,
  poster_path text,
  backdrop_path text,
  vote_average numeric,
  release_date date,
  slug text unique not null,
  media_type text check (media_type in ('movie', 'tv')),
  structure_type text check (structure_type in ('seasonal', 'absolute')),
  genres text[],
  characters jsonb default '[]'::jsonb,
  is_featured boolean default false,
  vote_count integer,
  trailer_key text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

create table if not exists episodes (
  id bigint primary key generated always as identity,
  anime_id bigint references animes(id) on delete cascade not null,
  tmdb_id integer,
  overview text,
  still_path text,
  vote_average numeric,
  air_date date,
  season_number integer not null,
  episode_number integer not null,
  absolute_episode_number integer,
  duration integer,
  video_url text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table animes enable row level security;
alter table episodes enable row level security;

create policy "Public animes are viewable by everyone."
  on animes for select
  using ( true );

create policy "Public episodes are viewable by everyone."
  on episodes for select
  using ( true );

-- Sadece adminler anime ekleyebilir
create policy "Only admins can insert animes"
  on animes for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Sadece adminler anime güncelleyebilir
create policy "Only admins can update animes"
  on animes for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Sadece adminler anime silebilir
create policy "Only admins can delete animes"
  on animes for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Sadece adminler episode ekleyebilir
create policy "Only admins can insert episodes"
  on episodes for insert
  with check (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Sadece adminler episode güncelleyebilir
create policy "Only admins can update episodes"
  on episodes for update
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- Sadece adminler episode silebilir
create policy "Only admins can delete episodes"
  on episodes for delete
  using (
    exists (
      select 1 from profiles
      where profiles.id = auth.uid()
      and profiles.role = 'admin'
    )
  );

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_animes_slug on animes(slug);
create index if not exists idx_animes_tmdb_id on animes(tmdb_id);
create index if not exists idx_animes_media_type on animes(media_type);
create index if not exists idx_animes_release_date on animes(release_date desc);
create index if not exists idx_animes_is_featured on animes(is_featured) where is_featured = true;

create index if not exists idx_episodes_anime_id on episodes(anime_id);
create index if not exists idx_episodes_season_episode on episodes(anime_id, season_number, episode_number);
create index if not exists idx_episodes_air_date on episodes(air_date desc);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Updated at trigger fonksiyonu
create or replace function public.handle_anime_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql;

-- Animes tablosu için updated_at trigger
drop trigger if exists set_animes_updated_at on animes;
create trigger set_animes_updated_at
    before update on animes
    for each row
    execute function public.handle_anime_updated_at();

-- Episodes tablosu için updated_at trigger
drop trigger if exists set_episodes_updated_at on episodes;
create trigger set_episodes_updated_at
    before update on episodes
    for each row
    execute function public.handle_anime_updated_at();
