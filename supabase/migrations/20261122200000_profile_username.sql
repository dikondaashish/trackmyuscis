-- Random usernames, Reddit style: Adjective-Noun-1234 (for example Calm-River-4821).
-- Every account gets one at sign-up; existing accounts get one now. People can't edit it
-- through the API (only first_name and last_name are granted for update).

create function public.generate_username()
returns text
language plpgsql
volatile
set search_path = ''
as $$
declare
  adjectives text[] := array[
    'Bright', 'Calm', 'Clever', 'Cozy', 'Brave', 'Gentle', 'Happy', 'Kind', 'Lucky', 'Merry',
    'Quiet', 'Rapid', 'Steady', 'Sunny', 'Swift', 'Warm', 'Wise', 'Bold', 'Fresh', 'Golden',
    'Hopeful', 'Jolly', 'Lively', 'Noble', 'Patient', 'Proud', 'Silver', 'Sincere', 'Smart', 'Tidy',
    'Vivid', 'Witty', 'Zesty', 'Breezy', 'Cheerful', 'Daring', 'Eager', 'Friendly', 'Grand', 'Humble'
  ];
  nouns text[] := array[
    'River', 'Harbor', 'Maple', 'Falcon', 'Meadow', 'Comet', 'Cedar', 'Willow', 'Summit', 'Canyon',
    'Lantern', 'Compass', 'Orchard', 'Pebble', 'Prairie', 'Sparrow', 'Tide', 'Valley', 'Breeze', 'Aurora',
    'Beacon', 'Bridge', 'Clover', 'Dune', 'Ember', 'Fern', 'Glacier', 'Horizon', 'Island', 'Juniper',
    'Kite', 'Lagoon', 'Magnolia', 'Nebula', 'Oasis', 'Pine', 'Quill', 'Robin', 'Sequoia', 'Voyage'
  ];
  candidate text;
begin
  loop
    candidate := adjectives[1 + floor(random() * array_length(adjectives, 1))::int]
      || '-' || nouns[1 + floor(random() * array_length(nouns, 1))::int]
      || '-' || (1000 + floor(random() * 9000))::int::text;
    exit when not exists (select 1 from public.profiles where username = candidate);
  end loop;
  return candidate;
end;
$$;

revoke execute on function public.generate_username() from public, anon, authenticated;

alter table public.profiles add column username text;
update public.profiles set username = public.generate_username() where username is null;
alter table public.profiles
  alter column username set default public.generate_username(),
  alter column username set not null,
  add constraint profiles_username_key unique (username);

comment on column public.profiles.username is 'Random public-safe username, Adjective-Noun-1234, set at sign-up.';
