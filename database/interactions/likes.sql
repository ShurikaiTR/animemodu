-- Reviews tablosuna title kolonu ekle
alter table reviews add column if not exists title varchar(200);

-- Comment beğenileri için junction table
create table if not exists comment_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  comment_id uuid references comments(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, comment_id)
);

-- Review beğenileri için junction table (helpful votes)
create table if not exists review_likes (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  review_id uuid references reviews(id) on delete cascade not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  
  unique(user_id, review_id)
);

-- RLS aktifleştir
alter table comment_likes enable row level security;
alter table review_likes enable row level security;

-- Comment likes policies
create policy "Comment likes are viewable by everyone" on comment_likes for select using (true);
create policy "Users can insert their own comment likes" on comment_likes for insert with check ((select auth.uid()) = user_id);

-- Combined DELETE policy: user owns the like OR user is admin
create policy "Users or admins can delete comment likes" on comment_likes for delete using (
    (select auth.uid()) = user_id
    OR exists (
        select 1 from profiles
        where profiles.id = (select auth.uid())
        and profiles.role = 'admin'
    )
);

-- Review likes policies
create policy "Review likes are viewable by everyone" on review_likes for select using (true);
create policy "Users can insert their own review likes" on review_likes for insert with check ((select auth.uid()) = user_id);

-- Combined DELETE policy: user owns the like OR user is admin
create policy "Users or admins can delete review likes" on review_likes for delete using (
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

create index if not exists idx_comment_likes_comment_id on comment_likes(comment_id);
create index if not exists idx_comment_likes_user_id on comment_likes(user_id);

create index if not exists idx_review_likes_review_id on review_likes(review_id);
create index if not exists idx_review_likes_user_id on review_likes(user_id);

-- =====================================================
-- TRIGGERS
-- =====================================================

-- Like count update fonksiyonları
create or replace function update_comment_like_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update comments set like_count = like_count + 1 where id = NEW.comment_id;
  elsif TG_OP = 'DELETE' then
    update comments set like_count = like_count - 1 where id = OLD.comment_id;
  end if;
  return null;
end;
$$ language plpgsql
set search_path = public;

create or replace function update_review_helpful_count()
returns trigger as $$
begin
  if TG_OP = 'INSERT' then
    update reviews set helpful_count = helpful_count + 1 where id = NEW.review_id;
  elsif TG_OP = 'DELETE' then
    update reviews set helpful_count = helpful_count - 1 where id = OLD.review_id;
  end if;
  return null;
end;
$$ language plpgsql
set search_path = public;

-- Triggerlar
drop trigger if exists comment_like_count_trigger on comment_likes;
create trigger comment_like_count_trigger
after insert or delete on comment_likes
for each row execute function update_comment_like_count();

drop trigger if exists review_helpful_count_trigger on review_likes;
create trigger review_helpful_count_trigger
after insert or delete on review_likes
for each row execute function update_review_helpful_count();
