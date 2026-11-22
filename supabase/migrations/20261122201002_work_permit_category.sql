-- What a work permit (Form I-765) is for. USCIS's case status doesn't say, and each
-- eligibility category has its own processing time, so the owner tells us once.

alter table public.cases
  add column filing_category text,
  add column filing_category_confirmed_at timestamptz,
  add column premium_processing boolean;

alter table public.cases
  add constraint cases_filing_category_known check (
    filing_category is null
    or filing_category in ('c3a', 'c3b', 'c3c', 'c8', 'a5', 'c9', 'c26', 'tps', 'c11', 'c33', 'other')
  );

comment on column public.cases.filing_category is
  'I-765 eligibility category the owner chose, e.g. c3b = (c)(3)(B) OPT after graduation. Null = not answered.';
comment on column public.cases.filing_category_confirmed_at is 'When the owner last chose filing_category. Set by trigger.';
comment on column public.cases.premium_processing is 'Owner says they paid for premium processing. Null = not answered.';

-- The owner may set these two; the confirmation time is always the database's own clock.
grant update (filing_category, premium_processing) on public.cases to authenticated;

create or replace function public.stamp_filing_category()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  if new.filing_category is distinct from old.filing_category then
    new.filing_category_confirmed_at := case when new.filing_category is null then null else now() end;
  end if;
  return new;
end;
$$;

revoke execute on function public.stamp_filing_category() from public, anon, authenticated;

create trigger cases_stamp_filing_category
  before update of filing_category on public.cases
  for each row execute function public.stamp_filing_category();
