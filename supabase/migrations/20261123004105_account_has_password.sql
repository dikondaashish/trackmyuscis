-- Whether the signed-in person can also sign in with email and password. Google-only accounts
-- have no password until they set one. Returns only a yes/no, never the hash.
create or replace function public.account_has_password()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(
    (select u.encrypted_password is not null and u.encrypted_password <> ''
       from auth.users u where u.id = auth.uid()),
    false
  );
$$;

revoke all on function public.account_has_password() from public, anon;
grant execute on function public.account_has_password() to authenticated;
