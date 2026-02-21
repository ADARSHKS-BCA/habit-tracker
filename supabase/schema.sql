-- 1. Profiles Table (Public User Data)
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  created_at timestamp with time zone default now()
);

-- Trigger to alleviate manual profile creation
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, username)
  values (new.id, split_part(new.email, '@', 1));
  return new;
end;
$$ language plpgsql security definer;

-- Drop trigger if exists to allow re-running script safely
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

-- 2. Habits Table
create table habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  name text not null,
  created_at timestamp with time zone default now()
);

-- 3. Checkins Table (The core activity log)
create table checkins (
  id uuid primary key default gen_random_uuid(),
  habit_id uuid references habits(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  date date not null,
  created_at timestamp with time zone default now(),
  unique (habit_id, user_id, date)
);

-- Index for Feed/Streak Performance
create index idx_checkins_user_date on checkins (user_id, date);

-- 4. Enable RLS
alter table profiles enable row level security;
alter table habits enable row level security;
alter table checkins enable row level security;

-- Policies for Profiles
create policy "Public profiles are viewable by everyone"
on profiles for select
using (true);

create policy "Users can update own profile"
on profiles for update
using (auth.uid() = id);

-- Policies for Habits
create policy "Users can view their own habits"
on habits for select
using (auth.uid() = user_id);

create policy "Users can manipulate their own habits"
on habits for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- Policies for Checkins
create policy "Checkins are viewable by everyone (for Feed)"
on checkins for select
using (true);

create policy "Users can manipulate their own checkins"
on checkins for all
using (auth.uid() = user_id)
with check (auth.uid() = user_id);

-- 5. Realtime Setup
-- Add 'checkins' table to the publication for Realtime
begin;
  drop publication if exists supabase_realtime;
  create publication supabase_realtime for table checkins;
commit;
