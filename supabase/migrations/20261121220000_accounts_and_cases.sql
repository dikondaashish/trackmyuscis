-- TrackMyUSCIS accounts: profiles, saved cases and policy consents.
-- Every table has row level security; a signed-in user can only reach their own rows.

-- Profiles ------------------------------------------------------------------
create table public.profiles (
  user_id uuid primary key references auth.users (id) on delete cascade,
  email text,
  first_name text check (char_length(first_name) <= 80),
  last_name text check (char_length(last_name) <= 80),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
comment on table public.profiles is 'One row per account, created automatically at sign-up.';

alter table public.profiles enable row level security;
create policy "Read own profile" on public.profiles for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Update own profile" on public.profiles for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
revoke update on public.profiles from authenticated;
grant update (first_name, last_name) on public.profiles to authenticated;

-- Create the profile when an account is created (email sign-up or Google).
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (user_id, email, first_name, last_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data ->> 'first_name', new.raw_user_meta_data ->> 'given_name'),
    coalesce(new.raw_user_meta_data ->> 'last_name', new.raw_user_meta_data ->> 'family_name')
  )
  on conflict (user_id) do update set email = excluded.email;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- Saved cases ---------------------------------------------------------------
-- Status columns are written by the server only (case checks); users can add,
-- rename and remove their own receipt numbers.
create table public.cases (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  receipt_number text not null check (receipt_number ~ '^[A-Z]{3}[0-9]{10}$'),
  label text check (char_length(label) <= 60),
  form_type text,
  current_status text,
  status_changed_at timestamptz,
  last_checked_at timestamptz,
  created_at timestamptz not null default now(),
  unique (user_id, receipt_number)
);
comment on table public.cases is 'Receipt numbers each account saved. Status columns are filled by the server.';
create index cases_user_id_idx on public.cases (user_id);

alter table public.cases enable row level security;
create policy "Read own cases" on public.cases for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Add own cases" on public.cases for insert to authenticated
  with check ((select auth.uid()) = user_id);
create policy "Rename own cases" on public.cases for update to authenticated
  using ((select auth.uid()) = user_id) with check ((select auth.uid()) = user_id);
create policy "Remove own cases" on public.cases for delete to authenticated
  using ((select auth.uid()) = user_id);
revoke insert, update on public.cases from authenticated;
grant insert (receipt_number, label) on public.cases to authenticated;
grant update (label) on public.cases to authenticated;

-- At most 10 saved cases per account.
create function public.limit_cases_per_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if (select count(*) from public.cases where user_id = new.user_id) >= 10 then
    raise exception 'case_limit_reached' using errcode = 'P0001',
      hint = 'You can save up to 10 cases.';
  end if;
  return new;
end;
$$;

create trigger limit_cases_per_user
  before insert on public.cases
  for each row execute function public.limit_cases_per_user();

-- Policy consents -----------------------------------------------------------
create table public.policy_consents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  policy text not null check (policy in ('terms', 'privacy')),
  policy_version text not null check (char_length(policy_version) <= 20),
  method text not null check (method in ('signup_checkbox', 'google_signup')),
  consented_at timestamptz not null default now()
);
comment on table public.policy_consents is 'Which Terms and Privacy versions each account agreed to, and when.';
create index policy_consents_user_id_idx on public.policy_consents (user_id);

alter table public.policy_consents enable row level security;
create policy "Read own consents" on public.policy_consents for select to authenticated
  using ((select auth.uid()) = user_id);
create policy "Record own consent" on public.policy_consents for insert to authenticated
  with check ((select auth.uid()) = user_id);
revoke insert on public.policy_consents from authenticated;
grant insert (policy, policy_version, method) on public.policy_consents to authenticated;

-- Nothing is reachable without signing in.
revoke all on public.profiles, public.cases, public.policy_consents from anon;

-- Trigger functions run on their own; nobody should call them through the API.
revoke execute on function public.handle_new_user() from public, anon, authenticated;
revoke execute on function public.limit_cases_per_user() from public, anon, authenticated;
