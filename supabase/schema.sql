-- RELLO database, version 1.
-- Run this once, in the Supabase dashboard: SQL Editor > New query > paste > Run.
-- It runs as one transaction, so if anything fails nothing is half-created.

begin;

-- ---------------------------------------------------------------------------
-- Tables
-- ---------------------------------------------------------------------------

create table public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  handle       text not null unique check (handle ~ '^[a-z0-9_]{3,30}$'),
  display_name text not null check (
                 char_length(display_name) <= 60 and display_name ~ '[^[:space:]]'),
  bio          text not null default '' check (char_length(bio) <= 160),
  location     text not null default '' check (char_length(location) <= 80),
  created_at   timestamptz not null default now()
);

create table public.posts (
  id               uuid primary key default gen_random_uuid(),
  author_id        uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  category         text not null check (category in (
                     'Safety / Crime', 'Traffic / Roads', 'Power / Water',
                     'Weather / Flood', 'Community Notice', 'Other')),
  body             text not null check (
                     char_length(body) <= 500 and body ~ '[^[:space:]]'),
  location         text not null default '' check (char_length(location) <= 80),
  comments_enabled boolean not null default true,
  -- Moderation: set this in the dashboard to remove a post from public view.
  hidden_at        timestamptz,
  created_at       timestamptz not null default now()
);

create index posts_newest_idx on public.posts (created_at desc, id desc);
create index posts_author_idx on public.posts (author_id, created_at desc, id desc);

create table public.comments (
  id         uuid primary key default gen_random_uuid(),
  post_id    uuid not null references public.posts (id) on delete cascade,
  author_id  uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  body       text not null check (char_length(body) <= 500 and body ~ '[^[:space:]]'),
  created_at timestamptz not null default now()
);

create index comments_post_idx on public.comments (post_id, created_at);

-- One 'like' and one 'confirmed' per person per post.
-- 'confirmed' is community confirmation, never official verification.
create table public.reactions (
  post_id    uuid not null references public.posts (id) on delete cascade,
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  kind       text not null check (kind in ('like', 'confirmed')),
  created_at timestamptz not null default now(),
  primary key (post_id, user_id, kind)
);

create table public.bookmarks (
  user_id    uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  post_id    uuid not null references public.posts (id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (user_id, post_id)
);

create table public.reports (
  id          uuid primary key default gen_random_uuid(),
  post_id     uuid not null references public.posts (id) on delete cascade,
  reporter_id uuid not null default auth.uid() references public.profiles (id) on delete cascade,
  reason      text not null check (char_length(reason) <= 300 and reason ~ '[^[:space:]]'),
  created_at  timestamptz not null default now(),
  unique (post_id, reporter_id)
);

-- ---------------------------------------------------------------------------
-- Create a public profile automatically when someone first signs in.
-- The handle is built from their name, never from their email address.
-- ---------------------------------------------------------------------------

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
declare
  full_name text;
  base      text;
begin
  full_name := left(btrim(coalesce(
    nullif(btrim(new.raw_user_meta_data ->> 'full_name'), ''),
    nullif(btrim(new.raw_user_meta_data ->> 'name'), ''),
    'RELLO member')), 60);

  base := btrim(regexp_replace(lower(full_name), '[^a-z0-9]+', '_', 'g'), '_');
  base := left(coalesce(nullif(base, ''), 'member'), 20);

  insert into public.profiles (id, handle, display_name)
  values (new.id, base || '_' || left(replace(gen_random_uuid()::text, '-', ''), 8), full_name);

  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Anyone who signed in before this script ran also gets a profile.
insert into public.profiles (id, handle, display_name)
select id, 'member_' || left(replace(id::text, '-', ''), 20), 'RELLO member'
from auth.users;

-- ---------------------------------------------------------------------------
-- Permissions, part 1: which tables and COLUMNS each role may touch.
-- anon = signed out, authenticated = signed in.
-- Columns left out of an insert grant (author, timestamps, hidden_at) can only
-- take their defaults, so nobody can post as someone else or backdate a post.
-- ---------------------------------------------------------------------------

revoke all on public.profiles, public.posts, public.comments,
              public.reactions, public.bookmarks, public.reports
  from anon, authenticated;

grant all on public.profiles, public.posts, public.comments,
             public.reactions, public.bookmarks, public.reports
  to service_role;

grant select on public.profiles, public.posts, public.comments, public.reactions
  to anon, authenticated;

grant update (handle, display_name, bio, location) on public.profiles to authenticated;

grant insert (category, body, location, comments_enabled) on public.posts to authenticated;
grant delete on public.posts to authenticated;

grant insert (post_id, body) on public.comments to authenticated;
grant delete on public.comments to authenticated;

grant insert (post_id, kind) on public.reactions to authenticated;
grant delete on public.reactions to authenticated;

grant select, delete on public.bookmarks to authenticated;
grant insert (post_id) on public.bookmarks to authenticated;

grant insert (post_id, reason) on public.reports to authenticated;

-- ---------------------------------------------------------------------------
-- Permissions, part 2: row level security decides which ROWS.
-- A hidden post, and everything attached to it, disappears for app users.
-- ---------------------------------------------------------------------------

alter table public.profiles  enable row level security;
alter table public.posts     enable row level security;
alter table public.comments  enable row level security;
alter table public.reactions enable row level security;
alter table public.bookmarks enable row level security;
alter table public.reports   enable row level security;

create policy "profiles are public"
  on public.profiles for select using (true);

create policy "edit your own profile"
  on public.profiles for update to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

create policy "visible posts are public"
  on public.posts for select using (hidden_at is null);

create policy "publish as yourself"
  on public.posts for insert to authenticated
  with check ((select auth.uid()) = author_id);

create policy "delete your own posts"
  on public.posts for delete to authenticated
  using ((select auth.uid()) = author_id);

create policy "comments on visible posts are public"
  on public.comments for select
  using (exists (select 1 from public.posts p where p.id = post_id));

create policy "comment as yourself where comments are on"
  on public.comments for insert to authenticated
  with check (
    (select auth.uid()) = author_id
    and exists (select 1 from public.posts p where p.id = post_id and p.comments_enabled)
  );

create policy "delete your own comments"
  on public.comments for delete to authenticated
  using ((select auth.uid()) = author_id);

create policy "reactions on visible posts are public"
  on public.reactions for select
  using (exists (select 1 from public.posts p where p.id = post_id));

-- You cannot confirm your own post.
create policy "react as yourself"
  on public.reactions for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (
      select 1 from public.posts p
      where p.id = post_id
        and (kind <> 'confirmed' or p.author_id <> (select auth.uid()))
    )
  );

create policy "remove your own reactions"
  on public.reactions for delete to authenticated
  using ((select auth.uid()) = user_id);

create policy "see your own bookmarks"
  on public.bookmarks for select to authenticated
  using ((select auth.uid()) = user_id);

create policy "bookmark visible posts"
  on public.bookmarks for insert to authenticated
  with check (
    (select auth.uid()) = user_id
    and exists (select 1 from public.posts p where p.id = post_id)
  );

create policy "remove your own bookmarks"
  on public.bookmarks for delete to authenticated
  using ((select auth.uid()) = user_id);

-- Reports can be sent but not read from the app. Review them in the dashboard.
create policy "report visible posts"
  on public.reports for insert to authenticated
  with check (
    (select auth.uid()) = reporter_id
    and exists (select 1 from public.posts p where p.id = post_id)
  );

commit;
