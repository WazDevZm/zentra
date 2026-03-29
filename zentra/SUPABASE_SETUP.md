# Supabase Setup for Zentra

## 1. Security first

You shared secret keys in chat. Rotate these immediately in Supabase:

- `service_role`
- `sb_secret_*`

Do **not** place secret keys in Expo client code.

## 2. Environment variables

Create `.env.local` in project root:

```env
EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

The app reads these values from `lib/supabase.ts`.

## 3. Install dependencies

```bash
npm install @supabase/supabase-js @react-native-async-storage/async-storage
```

## 4. Create schema in Supabase SQL editor

You can run the complete ready-made schema from:

- `supabase/zentra_schema.sql`

```sql
create extension if not exists pgcrypto;

create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  category text not null check (category in ('Church','Academic','Social','Sports','Tech')),
  date timestamptz not null,
  time text not null,
  location text not null,
  zone text not null,
  description text not null,
  organizer_name text not null,
  organizer_phone text,
  organizer_whatsapp text,
  image_url text,
  poster_url text,
  attendance_estimate int default 0,
  views int default 0,
  created_at timestamptz default now()
);

create table if not exists public.event_interests (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);

create table if not exists public.event_saves (
  user_id uuid not null references auth.users(id) on delete cascade,
  event_id uuid not null references public.events(id) on delete cascade,
  created_at timestamptz default now(),
  primary key (user_id, event_id)
);

create or replace view public.events_with_interest_count as
select e.*, coalesce(count(i.user_id), 0)::int as interested_count
from public.events e
left join public.event_interests i on i.event_id = e.id
group by e.id;
```

## 5. Enable RLS + policies

```sql
alter table public.events enable row level security;
alter table public.event_interests enable row level security;
alter table public.event_saves enable row level security;

create policy "events readable by authenticated"
on public.events for select
to authenticated
using (true);

create policy "interests readable by authenticated"
on public.event_interests for select
to authenticated
using (true);

create policy "insert own interest"
on public.event_interests for insert
to authenticated
with check (auth.uid() = user_id);

create policy "delete own interest"
on public.event_interests for delete
to authenticated
using (auth.uid() = user_id);

create policy "read own saves"
on public.event_saves for select
to authenticated
using (auth.uid() = user_id);

create policy "insert own save"
on public.event_saves for insert
to authenticated
with check (auth.uid() = user_id);

create policy "delete own save"
on public.event_saves for delete
to authenticated
using (auth.uid() = user_id);
```

## 6. Auth providers

In Supabase Dashboard > Authentication > Providers:

- Enable Email.
- Optionally enable Google.

## 7. What is already wired in app

- Supabase client: `lib/supabase.ts`
- Explore event fetch with fallback to local mocks: `lib/events.ts` and `app/(tabs)/explore.tsx`
- Sign in with Supabase: `app/sign-in.tsx`
- Sign up with Supabase: `app/sign-up.tsx`
- Splash routes by session state: `app/splash.tsx`

## 9. Secret key usage

- `SUPABASE_SERVICE_ROLE_KEY` and `SUPABASE_SECRET_KEY` are local-only in `.env.local`.
- They are not used by Expo client code.
- Use them only from secure backend code (Edge Functions/server).

## 8. Run app

```bash
npm start
```

If env values change, restart Metro so Expo picks new `EXPO_PUBLIC_*` values.
