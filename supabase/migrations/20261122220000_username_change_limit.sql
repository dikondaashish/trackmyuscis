-- Usernames can change once every 30 days. The first change away from the random name
-- is allowed at any time. People can't write username_changed_at themselves (no grant).

alter table public.profiles add column username_changed_at timestamptz;
comment on column public.profiles.username_changed_at is 'When the person last changed their username; null if never.';

create function public.limit_username_changes()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.username is distinct from old.username then
    if old.username_changed_at is not null and old.username_changed_at > now() - interval '30 days' then
      raise exception 'You can change your username once every 30 days.'
        using errcode = 'P0001', hint = 'username_cooldown';
    end if;
    new.username_changed_at := now();
  else
    -- Never let an update touch the timestamp without changing the name.
    new.username_changed_at := old.username_changed_at;
  end if;
  return new;
end;
$$;

revoke execute on function public.limit_username_changes() from public, anon, authenticated;

create trigger limit_username_changes
  before update on public.profiles
  for each row execute function public.limit_username_changes();
