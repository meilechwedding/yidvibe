-- Close authorization gaps found during the public-portfolio security review.

-- Private conversations: clients may read and send, but creation and read-state
-- changes go through guarded SECURITY DEFINER functions. Participants and sent
-- message contents are immutable from the client.
drop policy if exists "conversations insert participant" on public.conversations;
drop policy if exists "conversations update participant" on public.conversations;
drop policy if exists "cmessages update participant" on public.conversation_messages;
revoke insert on public.conversations from anon, authenticated;
revoke update on public.conversations from authenticated;
revoke update on public.conversations from anon;
revoke update on public.conversation_messages from authenticated;
revoke update on public.conversation_messages from anon;

create or replace function public.get_or_create_conversation(
  p_other uuid,
  p_about_type text default null,
  p_about_id uuid default null
) returns uuid
language plpgsql
security definer
set search_path = ''
as $$
declare
  me uuid := auth.uid();
  target public.profiles%rowtype;
  a uuid;
  b uuid;
  conversation_id uuid;
begin
  if me is null or p_other is null or me = p_other then
    return null;
  end if;

  select * into target from public.profiles where id = p_other;
  if not found then return null; end if;

  if me < p_other then a := me; b := p_other; else a := p_other; b := me; end if;

  select id into conversation_id
  from public.conversations
  where participant_a = a and participant_b = b;
  if conversation_id is not null then return conversation_id; end if;

  if target.dm_privacy = 'none' then return null; end if;
  if target.dm_privacy = 'followers' and not exists (
    select 1 from public.follows
    where follower_id = me and builder_id = p_other
  ) then
    return null;
  end if;

  if p_about_type is not null and length(p_about_type) > 64 then
    return null;
  end if;

  insert into public.conversations (
    participant_a, participant_b, about_type, about_id
  ) values (
    a, b, p_about_type, p_about_id
  )
  on conflict (participant_a, participant_b) do nothing
  returning id into conversation_id;

  if conversation_id is null then
    select id into conversation_id
    from public.conversations
    where participant_a = a and participant_b = b;
  end if;
  return conversation_id;
end;
$$;

revoke all on function public.get_or_create_conversation(uuid, text, uuid)
  from public, anon;
grant execute on function public.get_or_create_conversation(uuid, text, uuid)
  to authenticated;

create or replace function public.mark_conversation_read(p_conversation_id uuid)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then return; end if;

  update public.conversation_messages m
  set read_at = now()
  where m.conversation_id = p_conversation_id
    and m.sender_id <> auth.uid()
    and m.read_at is null
    and exists (
      select 1 from public.conversations c
      where c.id = p_conversation_id
        and (c.participant_a = auth.uid() or c.participant_b = auth.uid())
    );
end;
$$;

revoke all on function public.mark_conversation_read(uuid) from public, anon;
grant execute on function public.mark_conversation_read(uuid) to authenticated;

-- Anonymous projects and votes were easy to automate because client-provided
-- identifiers were the only deduplication. Require an authenticated account.
revoke insert, delete on public.upvotes from anon;
drop policy if exists "upvotes anon insert" on public.upvotes;
drop policy if exists "upvotes anon delete" on public.upvotes;

revoke insert on public.projects from anon;
drop policy if exists "projects insert community (anon)" on public.projects;

-- Public media remains readable, but uploads are limited to common browser image
-- formats and five MiB per object.
update storage.buckets
set file_size_limit = 5242880,
    allowed_mime_types = array['image/jpeg', 'image/png', 'image/webp', 'image/gif']
where id in ('avatars', 'project-media');

-- A winner must belong to the competition being closed, including for direct
-- database/API clients that bypass the server action.
create unique index if not exists competition_submissions_id_competition_uniq
  on public.competition_submissions (id, competition_id);

do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'competitions_winner_belongs_to_competition_fk'
  ) then
    alter table public.competitions
      add constraint competitions_winner_belongs_to_competition_fk
      foreign key (winner_submission_id, id)
      references public.competition_submissions (id, competition_id);
  end if;
end $$;
