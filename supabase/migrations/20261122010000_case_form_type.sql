-- Let people say which form a saved case is for (e.g. I-765), so the dashboard can show
-- that form's typical steps. Short codes only.
alter table public.cases
  add constraint cases_form_type_format check (form_type is null or form_type ~ '^[A-Z]{1,2}-[0-9]{1,4}[A-Z]?$');

grant insert (form_type) on public.cases to authenticated;
grant update (form_type) on public.cases to authenticated;
