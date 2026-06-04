-- Admin "Launch Control" feature flags.
-- Every gateable page/feature has a row; default OFF so Phase 1 ships focused
-- and the admin turns the bigger site on piece by piece.

create table if not exists public.feature_flags (
  key text primary key,
  enabled boolean not null default false,
  label text not null,
  description text,
  category text not null default 'module',
  updated_at timestamptz not null default now(),
  updated_by uuid references auth.users(id)
);

alter table public.feature_flags enable row level security;

-- Anyone (incl. anon) may READ flags — nav + route guards run server-side for
-- signed-out visitors too. This table holds no sensitive data.
drop policy if exists "feature_flags readable" on public.feature_flags;
create policy "feature_flags readable" on public.feature_flags
  for select using (true);

-- Only admins may WRITE. Uses the existing SECURITY DEFINER is_admin() helper so
-- the policy never re-queries a table under its own RLS (no recursion).
drop policy if exists "feature_flags admin write" on public.feature_flags;
create policy "feature_flags admin write" on public.feature_flags
  for all to authenticated
  using (public.is_admin()) with check (public.is_admin());

insert into public.feature_flags (key, label, description, category, enabled) values
  ('module.gigs',          'Gigs',              'Job board for builders.',                 'module',  false),
  ('module.competitions',  'Competitions',      'Build competitions.',                      'module',  false),
  ('module.directory',     'Business Directory','Get-listed business directory.',           'module',  false),
  ('module.events',        'Events',            'Community events calendar.',               'module',  false),
  ('module.messaging',     'Private messaging', 'Inbox + DMs between users.',               'module',  false),
  ('module.people',        'People directory',  'Browsable directory of public profiles.',  'module',  false),
  ('feature.homepage_stats','Homepage stats',   'Projects/builders counter on the landing.','feature', false)
on conflict (key) do nothing;
