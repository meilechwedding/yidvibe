-- "Claim this project" requests. A signed-in user claims a community submission
-- they made; an admin reviews and, on approve, the project's owner_id is set to
-- the claimant (done in the server action, not here).

create table if not exists public.claim_requests (
  id uuid primary key default gen_random_uuid(),
  project_id uuid not null references public.projects(id) on delete cascade,
  claimant_id uuid not null references auth.users(id) on delete cascade,
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  note text,
  created_at timestamptz not null default now(),
  reviewed_by uuid references auth.users(id),
  reviewed_at timestamptz,
  unique (project_id, claimant_id)
);

alter table public.claim_requests enable row level security;

-- Claimant may file a claim and see their own; admins see all.
drop policy if exists "claims insert own" on public.claim_requests;
create policy "claims insert own" on public.claim_requests
  for insert to authenticated with check (claimant_id = auth.uid());

drop policy if exists "claims select own or admin" on public.claim_requests;
create policy "claims select own or admin" on public.claim_requests
  for select to authenticated using (claimant_id = auth.uid() or public.is_admin());

-- Admins manage (approve/reject) everything. Uses the SECURITY DEFINER helper.
drop policy if exists "claims admin all" on public.claim_requests;
create policy "claims admin all" on public.claim_requests
  for all to authenticated using (public.is_admin()) with check (public.is_admin());
