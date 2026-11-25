-- Lawyer profile pages (/lawyers/<slug>) and reviews.
--
-- 1. More profile fields on lawyer_applications: a page address (slug), photo, full office
--    address, how consultations happen and what the first one costs, the year first licensed,
--    education and career lines, a longer "about", and the date we last checked the license.
-- 2. A public-read storage bucket for lawyer photos. Only the server (secret key) uploads.
-- 3. lawyer_reviews: ratings from signed-in TrackMyUSCIS users, saved by the server and held
--    as "pending" until a person publishes them. Like lawyer_applications, the public and
--    signed-in keys can't read or write the table at all.

-- 1. Profile fields --------------------------------------------------------------------------

alter table public.lawyer_applications
  add column slug text,
  add column photo_path text,
  add column office_street text,
  add column office_zip text,
  add column consultation_modes text[] not null default '{}',
  add column consultation_fee integer,
  add column licensed_since integer,
  add column education text[] not null default '{}',
  add column career text[] not null default '{}',
  add column license_checked_on date;

-- Existing applications get a page address from name, city and state, plus part of the id.
update public.lawyer_applications
set slug = trim(both '-' from regexp_replace(
    translate(lower(full_name || '-' || office_city || '-' || office_state), 'áàâäãåāéèêëēíìîïīóòôöõøōúùûüūñçýÿ', 'aaaaaaaeeeeeiiiiiooooooouuuuuncyy'),
    '[^a-z0-9]+', '-', 'g'))
  || '-' || left(id::text, 6)
where slug is null;

alter table public.lawyer_applications
  alter column slug set not null,
  add constraint lawyer_applications_slug_unique unique (slug),
  add constraint lawyer_applications_slug check (slug ~ '^[a-z0-9]+(-[a-z0-9]+)*$' and char_length(slug) between 3 and 120),
  add constraint lawyer_applications_photo_path check (photo_path is null or photo_path ~ '^[0-9a-f-]{36}\.(jpg|png|webp)$'),
  add constraint lawyer_applications_office_street check (office_street is null or char_length(btrim(office_street)) between 3 and 120),
  add constraint lawyer_applications_office_zip check (office_zip is null or office_zip ~ '^[0-9]{5}(-[0-9]{4})?$'),
  add constraint lawyer_applications_consultation_modes check (consultation_modes <@ array['video', 'phone', 'in_person']::text[]),
  add constraint lawyer_applications_consultation_fee check (consultation_fee is null or consultation_fee between 1 and 5000),
  add constraint lawyer_applications_licensed_since check (licensed_since is null or licensed_since between 1950 and 2100),
  add constraint lawyer_applications_education check (cardinality(education) <= 4 and coalesce(char_length(array_to_string(education, '')), 0) <= 600),
  add constraint lawyer_applications_career check (cardinality(career) <= 5 and coalesce(char_length(array_to_string(career, '')), 0) <= 750),
  -- A free first consultation has no fee.
  add constraint lawyer_applications_free_has_no_fee check (not (free_consultation and consultation_fee is not null));

-- The "about" text can now be longer: the list shows the start, the profile page shows it all.
alter table public.lawyer_applications drop constraint lawyer_applications_bio;
alter table public.lawyer_applications
  add constraint lawyer_applications_bio check (char_length(btrim(bio)) between 40 and 1500);

comment on column public.lawyer_applications.slug is 'Address of the public profile: /lawyers/<slug>.';
comment on column public.lawyer_applications.license_checked_on is 'When we last confirmed the license (state bar) or accreditation (DOJ roster). Set by hand.';

-- updated_at now moves on every change (the sitemap uses it).
create function public.touch_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

create trigger lawyer_applications_touch before update on public.lawyer_applications
  for each row execute function public.touch_updated_at();

-- 2. Photos ----------------------------------------------------------------------------------

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('lawyer-photos', 'lawyer-photos', true, 1048576, array['image/png', 'image/jpeg', 'image/webp'])
on conflict (id) do nothing;
-- No storage policies: only the server's secret key can add or remove files.

-- 3. Reviews ---------------------------------------------------------------------------------

create table public.lawyer_reviews (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  lawyer_id uuid not null references public.lawyer_applications (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  rating smallint not null constraint lawyer_reviews_rating check (rating between 1 and 5),
  body text not null constraint lawyer_reviews_body check (char_length(btrim(body)) between 20 and 1000),
  -- Whether the reviewer hired the lawyer or only had a consultation.
  relationship text not null constraint lawyer_reviews_relationship check (relationship in ('client', 'consultation')),
  -- Shown with the review: first name and last initial, saved when it is written.
  reviewer_name text not null constraint lawyer_reviews_reviewer_name check (char_length(reviewer_name) between 1 and 40),
  -- pending: waiting for our check. published: shown. rejected: broke the review rules.
  status text not null default 'pending'
    constraint lawyer_reviews_status check (status in ('pending', 'published', 'rejected')),
  constraint lawyer_reviews_one_per_person unique (lawyer_id, user_id)
);

comment on table public.lawyer_reviews is 'Reviews of listed lawyers by signed-in users. Server-only; published by hand after a check.';

create index lawyer_reviews_lawyer on public.lawyer_reviews (lawyer_id) where status = 'published';
create index lawyer_reviews_status on public.lawyer_reviews (status, created_at desc);
create index lawyer_reviews_user on public.lawyer_reviews (user_id, created_at desc);

alter table public.lawyer_reviews enable row level security;
revoke all on public.lawyer_reviews from anon, authenticated;
