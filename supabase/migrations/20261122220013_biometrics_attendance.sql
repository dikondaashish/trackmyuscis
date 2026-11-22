-- The date someone says they went to their biometrics appointment. USCIS's status only
-- says it was scheduled (until it later says fingerprints were taken), so the owner
-- confirms it. Their own record: it never changes the USCIS status.
alter table public.cases
  add column biometrics_attended_date date,
  add column biometrics_confirmed_at timestamptz,
  add constraint cases_biometrics_not_future check (
    biometrics_attended_date is null or biometrics_attended_date <= (now() at time zone 'utc')::date + 1
  );

comment on column public.cases.biometrics_attended_date is 'Date the owner says they completed biometrics. Their own record, not from USCIS.';
comment on column public.cases.biometrics_confirmed_at is 'When the owner last set biometrics_attended_date. Set by trigger.';

grant update (biometrics_attended_date) on public.cases to authenticated;

create or replace function public.stamp_biometrics_confirmed()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.biometrics_attended_date is distinct from old.biometrics_attended_date then
    new.biometrics_confirmed_at := case when new.biometrics_attended_date is null then null else now() end;
  end if;
  return new;
end;
$$;

revoke execute on function public.stamp_biometrics_confirmed() from public, anon, authenticated;

create trigger cases_stamp_biometrics_confirmed
  before update of biometrics_attended_date on public.cases
  for each row execute function public.stamp_biometrics_confirmed();
