-- Community profile: a public-facing name, bio and photo kept apart from the person's real
-- (personal) name, email and Google photo. Nothing reads these publicly yet; the community
-- features will. The username (profiles.username) belongs to the community profile too.

alter table public.profiles
  add column community_name text,
  add column community_bio text,
  add column community_avatar_path text,
  add constraint profiles_community_name_length
    check (community_name is null or char_length(btrim(community_name)) between 1 and 40),
  add constraint profiles_community_name_not_official
    check (community_name is null or lower(community_name) !~ '(uscis|trackmy|dhs|government|official)'),
  add constraint profiles_community_bio_length
    check (community_bio is null or char_length(community_bio) <= 160),
  -- Photos live in the community-avatars bucket under the owner's own folder.
  add constraint profiles_community_avatar_own_folder
    check (community_avatar_path is null or community_avatar_path like user_id::text || '/%');

comment on column public.profiles.community_name is 'Display name for the community profile (not the real name).';
comment on column public.profiles.community_bio is 'Short public bio, up to 160 characters.';
comment on column public.profiles.community_avatar_path is 'Path of the community photo in storage bucket community-avatars.';

grant update (community_name, community_bio, community_avatar_path) on public.profiles to authenticated;

-- Storage: public-read bucket for community photos; images only, up to 2 MB.
insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('community-avatars', 'community-avatars', true, 2097152, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;

-- People may add and remove files only in their own folder (<user id>/...).
create policy "Upload own community photo" on storage.objects for insert to authenticated
  with check (bucket_id = 'community-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
create policy "Delete own community photo" on storage.objects for delete to authenticated
  using (bucket_id = 'community-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
-- Removing a file reads it first, so owners also need to see their own folder's rows.
create policy "Read own community photo rows" on storage.objects for select to authenticated
  using (bucket_id = 'community-avatars' and (storage.foldername(name))[1] = (select auth.uid())::text);
