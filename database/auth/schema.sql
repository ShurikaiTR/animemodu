drop table if exists profiles cascade;

create table if not exists profiles (
    id uuid primary key references auth.users(id) on delete cascade,
    username text unique,
    full_name text,
    avatar_url text default '/default-avatar.webp',
    banner_url text default '/banner-placeholder.webp',
    bio text,
    location text,
    social_media jsonb default '{}'::jsonb,
    age text,
    role text default 'user' check (role in ('user', 'admin')),
    created_at timestamp with time zone default timezone('utc'::text, now()) not null,
    updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

alter table profiles 
add column if not exists avatar_url text default '/default-avatar.webp';

alter table profiles 
add column if not exists updated_at timestamp with time zone default timezone('utc'::text, now());

alter table profiles 
add column if not exists role text default 'user' check (role in ('user', 'admin'));

update profiles 
set avatar_url = '/default-avatar.webp' 
where avatar_url is null or avatar_url = '';

update profiles 
set updated_at = created_at 
where updated_at is null;

update profiles 
set role = 'user' 
where role is null;

create index if not exists profiles_username_idx on profiles(username);

alter table profiles enable row level security;

drop policy if exists "Users can view own profile." on profiles;
drop policy if exists "Public profiles are viewable by everyone." on profiles;
drop policy if exists "Users can update own profile." on profiles;
drop policy if exists "Users can delete own profile." on profiles;

-- "Users can view own profile" is redundant because "Public profiles are viewable by everyone" covers it for SELECT.
-- Removed:
-- create policy "Users can view own profile."
--     on profiles for select
--     using ( auth.uid() = id );

create policy "Public profiles are viewable by everyone."
    on profiles for select
    using ( true );

create policy "Users can update own profile."
    on profiles for update
    using ( (select auth.uid()) = id );

create policy "Users can delete own profile."
    on profiles for delete
    using ( (select auth.uid()) = id );

drop trigger if exists on_auth_user_created on auth.users;
drop function if exists public.handle_new_user();

create or replace function public.handle_new_user()
returns trigger as $$
begin
    insert into public.profiles (id, username, full_name, avatar_url, role, created_at, updated_at)
    values (
        new.id,
        coalesce(nullif(trim(new.raw_user_meta_data->>'username'), ''), split_part(new.email, '@', 1)),
        coalesce(new.raw_user_meta_data->>'full_name', ''),
        '/default-avatar.webp',
        'user',
        timezone('utc'::text, now()),
        timezone('utc'::text, now())
    );
    return new;
end;
$$ language plpgsql security definer 
set search_path = public;

create or replace function public.handle_updated_at()
returns trigger as $$
begin
    new.updated_at = timezone('utc'::text, now());
    return new;
end;
$$ language plpgsql
set search_path = public;

drop trigger if exists set_updated_at on profiles;
create trigger set_updated_at
    before update on profiles
    for each row
    execute function public.handle_updated_at();

create trigger on_auth_user_created
    after insert on auth.users
    for each row
    execute function public.handle_new_user();
