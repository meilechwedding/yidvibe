-- Anonymous, device-deduped upvotes.
--
-- Signed-in upvotes stay one-per-user (the existing UNIQUE (project_id, user_id)
-- still covers non-null user_id). Signed-out upvotes dedupe one-per-device (a
-- cookie token) per project via a partial unique index.
--
-- Verified against the live schema (2026-06-04): the upvotes PRIMARY KEY is on
-- `id` (not user_id), so dropping NOT NULL on user_id is safe — no PK surgery.

alter table public.upvotes alter column user_id drop not null;
alter table public.upvotes add column if not exists device_id text;

-- one vote per device per project (anonymous rows only)
create unique index if not exists upvotes_device_uniq
  on public.upvotes (project_id, device_id) where user_id is null and device_id is not null;

grant insert, delete on public.upvotes to anon;

drop policy if exists "upvotes anon insert" on public.upvotes;
create policy "upvotes anon insert" on public.upvotes
  for insert to anon with check (user_id is null and device_id is not null);

drop policy if exists "upvotes anon delete" on public.upvotes;
create policy "upvotes anon delete" on public.upvotes
  for delete to anon using (user_id is null and device_id is not null);
