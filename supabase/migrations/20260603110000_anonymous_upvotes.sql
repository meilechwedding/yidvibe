-- Anonymous, device-deduped upvotes.
--
-- Signed-in upvotes stay one-per-user-per-project; signed-out upvotes dedupe
-- one-per-device (a cookie token) per project. The app also soft-rate-limits.
--
-- ⚠️ REVIEW BEFORE PROD: if `upvotes` has a primary key on (user_id, project_id),
-- `drop not null` on user_id will fail — drop/recreate that PK as a unique index
-- first. Apply on a dev branch and test anon + auth voting.

alter table public.upvotes alter column user_id drop not null;
alter table public.upvotes add column if not exists device_id text;

-- one vote per signed-in user per project
create unique index if not exists upvotes_user_uniq
  on public.upvotes (project_id, user_id) where user_id is not null;

-- one vote per device per project (anonymous)
create unique index if not exists upvotes_device_uniq
  on public.upvotes (project_id, device_id) where user_id is null and device_id is not null;

grant insert, delete on public.upvotes to anon;

drop policy if exists "upvotes anon insert" on public.upvotes;
create policy "upvotes anon insert" on public.upvotes
  for insert to anon with check (user_id is null and device_id is not null);

drop policy if exists "upvotes anon delete" on public.upvotes;
create policy "upvotes anon delete" on public.upvotes
  for delete to anon using (user_id is null and device_id is not null);
