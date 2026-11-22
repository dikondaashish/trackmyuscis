-- Let people change their username in Settings.
-- Rules: 3 to 24 characters; letters, numbers, - and _; starts and ends with a letter or number;
-- unique ignoring case; no names that look official (USCIS, TrackMyUSCIS, admin, support...).

alter table public.profiles
  add constraint profiles_username_format
    check (username ~ '^[A-Za-z0-9][A-Za-z0-9_-]{1,22}[A-Za-z0-9]$'),
  add constraint profiles_username_not_reserved
    check (
      lower(username) !~ '(uscis|trackmy|dhs|government|official)'
      and lower(username) !~ '^(admin|administrator|support|help|moderator|mod|staff|team|root|system|null|undefined)$'
    );

-- Unique regardless of case, so Calm-River-4821 and calm-river-4821 can't both exist.
create unique index profiles_username_lower_key on public.profiles (lower(username));

-- Random names now check uniqueness the same way.
create or replace function public.generate_username()
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
    exit when not exists (select 1 from public.profiles where lower(username) = lower(candidate));
  end loop;
  return candidate;
end;
$$;

revoke execute on function public.generate_username() from public, anon, authenticated;

-- The owner may now update their username too (row level security still limits it to their row).
grant update (username) on public.profiles to authenticated;
