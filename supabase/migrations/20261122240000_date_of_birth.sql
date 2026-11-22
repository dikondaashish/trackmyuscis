-- Optional date of birth on the private personal profile. Typed by the person in Settings
-- (never taken from Google), only ever read by its owner (row level security), and removable.

alter table public.profiles
  add column date_of_birth date,
  add constraint profiles_date_of_birth_range
    check (date_of_birth is null or (date_of_birth >= date '1900-01-01' and date_of_birth <= current_date));

comment on column public.profiles.date_of_birth is 'Optional, private. Entered by the person in Settings.';

grant update (date_of_birth) on public.profiles to authenticated;
