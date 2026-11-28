-- RELLO photos: one optional photo per entry.
-- Run once, after schema.sql: SQL Editor > New query > paste > Run.
-- It runs as one transaction, so if anything fails nothing is half-created.

begin;

-- ---------------------------------------------------------------------------
-- Entries
-- ---------------------------------------------------------------------------

alter table public.posts add column image_path text;

-- The file must sit in the author's own folder: <author id>/<random id>.jpg
alter table public.posts add constraint posts_image_path_check check (
  image_path ~ ('^' || author_id::text || '/[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}[.]jpg$')
);

alter table public.posts add constraint posts_image_path_key unique (image_path);

-- An entry needs words, a photo, or both.
alter table public.posts drop constraint posts_body_check;
alter table public.posts add constraint posts_body_check check (
  char_length(body) <= 500 and (body ~ '[^[:space:]]' or image_path is not null)
);

grant insert (image_path) on public.posts to authenticated;

-- ---------------------------------------------------------------------------
-- File storage. The bucket is public, so anyone with a photo's address can view
-- it. Only small JPEGs are accepted; the app shrinks photos before sending them.
-- ---------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('post-photos', 'post-photos', true, 1048576, array['image/jpeg']);

create policy "upload photos to your own folder"
  on storage.objects for insert to authenticated
  with check (
    bucket_id = 'post-photos'
    and name ~ ('^' || (select auth.uid())::text || '/[0-9a-f-]{36}[.]jpg$')
  );

-- Removing a file needs both of these. Viewing a public photo needs neither.
create policy "find your own photo files"
  on storage.objects for select to authenticated
  using (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

create policy "delete your own photo files"
  on storage.objects for delete to authenticated
  using (
    bucket_id = 'post-photos'
    and (storage.foldername(name))[1] = (select auth.uid())::text
  );

commit;
