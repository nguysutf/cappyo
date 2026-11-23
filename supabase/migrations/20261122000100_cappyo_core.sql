create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  username text unique not null,
  display_name text not null,
  avatar_url text,
  xp integer not null default 0 check (xp >= 0),
  streak_count integer not null default 0 check (streak_count >= 0),
  hearts integer not null default 5 check (hearts between 0 and 5),
  daily_goal integer not null default 20 check (daily_goal > 0),
  last_active_date date,
  created_at timestamptz not null default timezone('utc', now()),
  updated_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.journeys (
  id text primary key,
  slug text unique not null,
  title text not null,
  description text not null,
  icon text not null default 'database',
  color text not null default 'primary',
  sort_order integer not null default 0
);

create table if not exists public.modules (
  id text primary key,
  journey_id text not null references public.journeys(id) on delete cascade,
  title text not null,
  description text not null,
  color text not null default 'primary',
  sort_order integer not null default 0
);

create table if not exists public.lessons (
  id text primary key,
  module_id text not null references public.modules(id) on delete cascade,
  title text not null,
  description text not null default '',
  sort_order integer not null default 0,
  xp_reward integer not null default 100,
  estimated_minutes integer not null default 5,
  available boolean not null default false
);

create table if not exists public.exercises (
  id text primary key,
  lesson_id text not null references public.lessons(id) on delete cascade,
  type text not null check (type in ('multiple-choice', 'text-completion', 'code-completion', 'code-writing')),
  position integer not null default 0,
  payload jsonb not null default '{}'::jsonb
);

create table if not exists public.user_lesson_progress (
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  completed_at timestamptz,
  xp_earned integer not null default 0,
  best_accuracy integer not null default 0 check (best_accuracy between 0 and 100),
  attempts integer not null default 0,
  primary key (user_id, lesson_id)
);

create table if not exists public.user_exercise_attempts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references public.profiles(id) on delete cascade,
  lesson_id text not null references public.lessons(id) on delete cascade,
  exercise_id text not null references public.exercises(id) on delete cascade,
  answer text not null default '',
  is_correct boolean not null default false,
  execution_result jsonb,
  created_at timestamptz not null default timezone('utc', now())
);

create table if not exists public.user_daily_stats (
  user_id uuid not null references public.profiles(id) on delete cascade,
  activity_date date not null,
  xp_earned integer not null default 0,
  exercises_completed integer not null default 0,
  primary key (user_id, activity_date)
);

create index if not exists lessons_module_sort_idx on public.lessons(module_id, sort_order);
create index if not exists exercises_lesson_position_idx on public.exercises(lesson_id, position);
create index if not exists attempts_user_created_idx on public.user_exercise_attempts(user_id, created_at desc);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = timezone('utc', now());
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute procedure public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, username, display_name)
  values (
    new.id,
    coalesce(new.raw_user_meta_data ->> 'username', 'player_' || left(new.id::text, 8)),
    coalesce(new.raw_user_meta_data ->> 'display_name', split_part(coalesce(new.email, 'player'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

alter table public.profiles enable row level security;
alter table public.user_lesson_progress enable row level security;
alter table public.user_exercise_attempts enable row level security;
alter table public.user_daily_stats enable row level security;

drop policy if exists "profiles are readable by everyone" on public.profiles;
create policy "profiles are readable by everyone" on public.profiles for select using (true);
drop policy if exists "users can update their own profile" on public.profiles;
create policy "users can update their own profile" on public.profiles for update using (auth.uid() = id) with check (auth.uid() = id);

drop policy if exists "users can read their own progress" on public.user_lesson_progress;
create policy "users can read their own progress" on public.user_lesson_progress for select using (auth.uid() = user_id);
drop policy if exists "users can write their own progress" on public.user_lesson_progress;
create policy "users can write their own progress" on public.user_lesson_progress for insert with check (auth.uid() = user_id);
drop policy if exists "users can update their own progress" on public.user_lesson_progress;
create policy "users can update their own progress" on public.user_lesson_progress for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

drop policy if exists "users can read their own attempts" on public.user_exercise_attempts;
create policy "users can read their own attempts" on public.user_exercise_attempts for select using (auth.uid() = user_id);
drop policy if exists "users can write their own attempts" on public.user_exercise_attempts;
create policy "users can write their own attempts" on public.user_exercise_attempts for insert with check (auth.uid() = user_id);

drop policy if exists "users can read their own daily stats" on public.user_daily_stats;
create policy "users can read their own daily stats" on public.user_daily_stats for select using (auth.uid() = user_id);
drop policy if exists "users can write their own daily stats" on public.user_daily_stats;
create policy "users can write their own daily stats" on public.user_daily_stats for insert with check (auth.uid() = user_id);
drop policy if exists "users can update their own daily stats" on public.user_daily_stats;
create policy "users can update their own daily stats" on public.user_daily_stats for update using (auth.uid() = user_id) with check (auth.uid() = user_id);

alter table public.journeys enable row level security;
alter table public.modules enable row level security;
alter table public.lessons enable row level security;
alter table public.exercises enable row level security;

create policy "published journeys are readable" on public.journeys for select using (true);
create policy "published modules are readable" on public.modules for select using (true);
create policy "published lessons are readable" on public.lessons for select using (true);
create policy "published exercises are readable" on public.exercises for select using (true);
