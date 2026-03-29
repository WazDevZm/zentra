-- Zentra Supabase schema
-- Run this in Supabase SQL Editor.

create extension if not exists pgcrypto;

-- Profiles
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  avatar_url text,
  created_at timestamptz default now()
);

-- Events
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Church', 'Academic', 'Social', 'Sports', 'Tech')),
  date timestamptz not null,
  time text not null,
  location text not null,
  zone text not null,
  description text not null,
  organizer_id uuid references auth.users(id) on delete set null,
  organizer_name text not null,
  organizer_phone text,
  organizer_whatsapp text,
  image_url text,
  poster_url text,
  attendance_estimate int not null default 0,
  views int not null default 0,
  created_at timestamptz not null default now()
);

-- Interested relation
create table if not exists public.event_interests (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

-- Saved relation
create table if not exists public.event_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, event_id)
);

-- Notifications
create table if not exists public.notifications (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  title text not null,
  body text not null,
  read boolean not null default false,
  category text check (category in ('Church', 'Academic', 'Social', 'Sports', 'Tech')),
  event_id uuid references public.events(id) on delete set null,
  created_at timestamptz not null default now()
);

-- View for aggregate interested count
create or replace view public.events_with_interest_count as
select
  e.*,
  coalesce(count(i.user_id), 0)::int as interested_count
from public.events e
left join public.event_interests i on i.event_id = e.id
group by e.id;

-- Indexes
create index if not exists idx_events_date on public.events (date);
create index if not exists idx_events_category on public.events (category);
create index if not exists idx_event_interests_event_id on public.event_interests (event_id);
create index if not exists idx_event_saves_event_id on public.event_saves (event_id);
create index if not exists idx_notifications_user_id on public.notifications (user_id);

-- RLS
alter table public.profiles enable row level security;
alter table public.events enable row level security;
alter table public.event_interests enable row level security;
alter table public.event_saves enable row level security;
alter table public.notifications enable row level security;

-- Profiles policies
create policy "profiles_select_authenticated"
on public.profiles for select
to authenticated
using (true);

create policy "profiles_insert_own"
on public.profiles for insert
to authenticated
with check (auth.uid() = id);

create policy "profiles_update_own"
on public.profiles for update
to authenticated
using (auth.uid() = id)
with check (auth.uid() = id);

-- Events policies
create policy "events_select_authenticated"
on public.events for select
to authenticated
using (true);

create policy "events_insert_own"
on public.events for insert
to authenticated
with check (auth.uid() = organizer_id);

create policy "events_update_own"
on public.events for update
to authenticated
using (auth.uid() = organizer_id)
with check (auth.uid() = organizer_id);

create policy "events_delete_own"
on public.events for delete
to authenticated
using (auth.uid() = organizer_id);

-- Event interests policies
create policy "event_interests_select_authenticated"
on public.event_interests for select
to authenticated
using (true);

create policy "event_interests_insert_own"
on public.event_interests for insert
to authenticated
with check (auth.uid() = user_id);

create policy "event_interests_delete_own"
on public.event_interests for delete
to authenticated
using (auth.uid() = user_id);

-- Event saves policies
create policy "event_saves_select_own"
on public.event_saves for select
to authenticated
using (auth.uid() = user_id);

create policy "event_saves_insert_own"
on public.event_saves for insert
to authenticated
with check (auth.uid() = user_id);

create policy "event_saves_delete_own"
on public.event_saves for delete
to authenticated
using (auth.uid() = user_id);

-- Notifications policies
create policy "notifications_select_own"
on public.notifications for select
to authenticated
using (auth.uid() = user_id);

create policy "notifications_update_own"
on public.notifications for update
to authenticated
using (auth.uid() = user_id)
with check (auth.uid() = user_id);
