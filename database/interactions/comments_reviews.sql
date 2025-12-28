create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  anime_id uuid references animes(id) on delete cascade not null,
  rating decimal(3,1) check (rating >= 0 and rating <= 10),
  content text not null,
  is_spoiler boolean default false,
  is_verified_critic boolean default false,
  helpful_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, anime_id)
);

create table if not exists comments (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  anime_id uuid references animes(id) on delete cascade not null,
  episode_id uuid references episodes(id) on delete cascade,
  parent_id uuid references comments(id) on delete cascade,
  content text not null,
  is_spoiler boolean default false,
  is_pinned boolean default false,
  like_count int default 0,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table reviews enable row level security;
alter table comments enable row level security;

create policy "Reviews are viewable by everyone" on reviews for select using (true);
create policy "Users can insert their own reviews" on reviews for insert with check ((select auth.uid()) = user_id);
create policy "Users can update their own reviews" on reviews for update using ((select auth.uid()) = user_id);

-- Combined DELETE policy: user owns the review OR user is admin
create policy "Users or admins can delete reviews" on reviews for delete using (
    (select auth.uid()) = user_id
    OR exists (
        select 1 from profiles
        where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
);

create policy "Comments are viewable by everyone" on comments for select using (true);
create policy "Users can insert their own comments" on comments for insert with check ((select auth.uid()) = user_id);
create policy "Users can update their own comments" on comments for update using ((select auth.uid()) = user_id);

-- Combined DELETE policy: user owns the comment OR user is admin
create policy "Users or admins can delete comments" on comments for delete using (
    (select auth.uid()) = user_id
    OR exists (
        select 1 from profiles
        where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
);

-- =====================================================
-- INDEXES
-- =====================================================

create index if not exists idx_comments_anime_id on comments(anime_id);
create index if not exists idx_comments_episode_id on comments(episode_id);
create index if not exists idx_comments_user_id on comments(user_id);
create index if not exists idx_comments_parent_id on comments(parent_id);
create index if not exists idx_comments_created_at on comments(created_at desc);

create index if not exists idx_reviews_anime_id on reviews(anime_id);
create index if not exists idx_reviews_user_id on reviews(user_id);
create index if not exists idx_reviews_rating on reviews(rating desc);
create index if not exists idx_reviews_created_at on reviews(created_at desc);
