-- The form a case is for now comes from USCIS (via the case engine), written by the server.
-- People no longer pick it, so their browsers can't write it either. Applied after the code
-- that stopped sending form_type was live.
revoke insert (form_type), update (form_type) on public.cases from authenticated;
comment on column public.cases.form_type is 'Form code from USCIS, e.g. I-765. Server only.';
