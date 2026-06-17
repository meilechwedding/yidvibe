-- Storage buckets + RLS for image uploads (avatars, project-media).
--
-- Image upload (src/lib/image/upload.ts) writes to `<uid>/<uuid>.<ext>` in the
-- `avatars` or `project-media` bucket from the browser as the signed-in user.
-- That requires (a) the buckets to exist and be public-readable, and (b) an
-- INSERT policy on storage.objects letting authenticated users write into their
-- own `<uid>/` folder. Without the INSERT policy the upload fails with
-- "new row violates row-level security policy" — surfaced to the user as a
-- generic "Upload failed".
--
-- Idempotent: safe to re-run. Buckets are upserted public; policies are
-- drop-if-exists + recreate. These are additive (permissive) policies, so they
-- don't weaken any stricter policy that may already exist.

-- 1) Buckets exist and are public-readable.
insert into storage.buckets (id, name, public)
values ('avatars', 'avatars', true), ('project-media', 'project-media', true)
on conflict (id) do update set public = true;

-- 2) Anyone can read objects in these public buckets.
drop policy if exists "yv media public read" on storage.objects;
create policy "yv media public read" on storage.objects
  for select to public
  using (bucket_id in ('avatars', 'project-media'));

-- 3) A signed-in user can upload only into their own `<uid>/` folder.
drop policy if exists "yv media insert own" on storage.objects;
create policy "yv media insert own" on storage.objects
  for insert to authenticated
  with check (
    bucket_id in ('avatars', 'project-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

-- 4) …and replace/remove their own files (upsert overwrites, edits replace).
drop policy if exists "yv media update own" on storage.objects;
create policy "yv media update own" on storage.objects
  for update to authenticated
  using (
    bucket_id in ('avatars', 'project-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  )
  with check (
    bucket_id in ('avatars', 'project-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );

drop policy if exists "yv media delete own" on storage.objects;
create policy "yv media delete own" on storage.objects
  for delete to authenticated
  using (
    bucket_id in ('avatars', 'project-media')
    and (storage.foldername(name))[1] = auth.uid()::text
  );
