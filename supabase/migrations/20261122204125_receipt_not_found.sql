-- Receipt numbers USCIS doesn't recognize, and a daily limit on adding receipt numbers.

-- What the case engine reports: USCIS says it doesn't know this receipt (usually a typo,
-- sometimes a filing too new to be in its system yet), and whether the engine has stopped
-- retrying it (after about two weeks). Written by the server only.
alter table public.cases
  add column uscis_not_found boolean not null default false,
  add column checks_stopped boolean not null default false;

comment on column public.cases.uscis_not_found is 'USCIS does not recognize this receipt number. Server only.';
comment on column public.cases.checks_stopped is 'Not found, and the case engine stopped retrying. Server only.';

-- Every receipt number someone adds, kept two days, so removing and re-adding doesn't get
-- around the limit. Only the account and the time; never the number itself.
create table public.case_additions (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  added_at timestamptz not null default now()
);
create index case_additions_user_recent on public.case_additions (user_id, added_at desc);
alter table public.case_additions enable row level security;
revoke all on public.case_additions from public, anon, authenticated;

comment on table public.case_additions is 'When each account added a receipt number, for the daily limit. Kept 2 days.';

-- 20 new receipt numbers per account per 24 hours: plenty for a family, and stops anyone
-- using us to try made-up numbers against USCIS.
create or replace function public.limit_case_additions()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  delete from public.case_additions where user_id = new.user_id and added_at < now() - interval '2 days';
  if (select count(*) from public.case_additions where user_id = new.user_id and added_at > now() - interval '1 day') >= 20 then
    raise exception 'daily_add_limit' using errcode = 'P0001';
  end if;
  insert into public.case_additions (user_id) values (new.user_id);
  return new;
end;
$$;

revoke execute on function public.limit_case_additions() from public, anon, authenticated;

create trigger cases_limit_additions
  before insert on public.cases
  for each row execute function public.limit_case_additions();
