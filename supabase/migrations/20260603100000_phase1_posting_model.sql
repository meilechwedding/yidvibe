-- Phase 1 posting model.
--
-- Standalone "community submissions" (a tool found on the web — no builder) and
-- a creator tracker. `owner_id` becomes nullable; `submitted_by` records who
-- created the row (null for guests); `is_community` marks found/unattributed
-- posts. Also adds one level of comment replies (`comments.parent_id`).
--
-- ⚠️ RLS REVIEW REQUIRED BEFORE PROD: the base `projects`/`comments` policies
-- predate the repo's migration files (applied directly to the project), so this
-- migration ADDS permissive policies rather than editing unknown ones. Apply on
-- a Supabase dev branch first and TEST inserts as both anon and authenticated.
-- A `projects` policy must NEVER re-query `projects` under RLS (infinite
-- recursion → outage); these only reference the new row's own columns.

alter table public.projects alter column owner_id drop not null;
alter table public.projects
  add column if not exists submitted_by uuid references auth.users(id) on delete set null;
alter table public.projects
  add column if not exists is_community boolean not null default false;

alter table public.comments
  add column if not exists parent_id uuid references public.comments(id) on delete cascade;
create index if not exists comments_parent_id_idx on public.comments(parent_id);

-- Guests (anon) may create community submissions only.
grant insert on public.projects to anon;
drop policy if exists "projects insert community (anon)" on public.projects;
create policy "projects insert community (anon)" on public.projects
  for insert to anon
  with check (is_community = true and owner_id is null and submitted_by is null);

-- Signed-in users may create their own project OR a community submission.
drop policy if exists "projects insert (authenticated phase1)" on public.projects;
create policy "projects insert (authenticated phase1)" on public.projects
  for insert to authenticated
  with check (
    submitted_by = auth.uid()
    and (owner_id = auth.uid() or (is_community = true and owner_id is null))
  );
