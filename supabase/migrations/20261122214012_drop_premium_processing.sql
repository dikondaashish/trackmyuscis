-- Premium processing is read from the USCIS case history now, so people are never asked.
revoke update (premium_processing) on public.cases from authenticated;
alter table public.cases drop column premium_processing;
