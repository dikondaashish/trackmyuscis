-- Lawyer directory applications: what an attorney or DOJ-accredited representative submits on
-- /lawyers/join. Rows are written only by the server (secret key) after validation and read only
-- by us while we check the license, so row-level security is on with no policies: the public
-- and signed-in keys can't read or write this table at all.

create table public.lawyer_applications (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  -- new: just received. verified: license checked. listed: shown in the directory.
  status text not null default 'new'
    constraint lawyer_applications_status check (status in ('new', 'verified', 'listed', 'rejected', 'withdrawn')),
  role text not null
    constraint lawyer_applications_role check (role in ('attorney', 'accredited_representative')),
  full_name text not null constraint lawyer_applications_full_name check (char_length(btrim(full_name)) between 2 and 80),
  firm_name text not null constraint lawyer_applications_firm_name check (char_length(btrim(firm_name)) between 2 and 120),
  email text not null constraint lawyer_applications_email check (char_length(email) <= 254 and email ~ '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'),
  phone text not null constraint lawyer_applications_phone check (char_length(phone) between 7 and 30),
  website text constraint lawyer_applications_website check (website is null or (char_length(website) <= 200 and website ~* '^https?://')),
  -- Attorneys: the state bar we check and their number there. Not used for accredited representatives.
  bar_state text constraint lawyer_applications_bar_state check (bar_state is null or bar_state ~ '^[A-Z]{2}$'),
  bar_number text constraint lawyer_applications_bar_number check (bar_number is null or char_length(bar_number) between 2 and 30),
  office_city text not null constraint lawyer_applications_office_city check (char_length(btrim(office_city)) between 2 and 60),
  office_state text not null constraint lawyer_applications_office_state check (office_state ~ '^[A-Z]{2}$'),
  languages text not null constraint lawyer_applications_languages check (char_length(btrim(languages)) between 2 and 120),
  practice_areas text[] not null constraint lawyer_applications_practice_areas check (cardinality(practice_areas) between 1 and 12),
  free_consultation boolean not null default false,
  bio text not null constraint lawyer_applications_bio check (char_length(btrim(bio)) between 40 and 400),
  -- Versions of the terms the applicant agreed to, and when.
  agreed_at timestamptz not null default now(),
  policy_version text not null,
  -- The listing fee quoted on the page when they applied, in US dollars a year.
  quoted_annual_fee integer not null,
  -- Our notes while checking the license (never shown publicly).
  review_notes text,
  constraint lawyer_applications_attorney_bar
    check (role <> 'attorney' or (bar_state is not null and bar_number is not null))
);

comment on table public.lawyer_applications is 'Applications to the lawyer directory from /lawyers/join. Server-only: no row-level security policies.';

create index lawyer_applications_created_at on public.lawyer_applications (created_at desc);
create index lawyer_applications_email on public.lawyer_applications (lower(email));
create index lawyer_applications_status on public.lawyer_applications (status);

alter table public.lawyer_applications enable row level security;
revoke all on public.lawyer_applications from anon, authenticated;
