-- Automatic status checks. The server (service role) fills these from the case engine;
-- people can read their own rows (existing RLS) but never write these columns.
alter table public.cases
  add column status_description text,
  add column status_history jsonb not null default '[]'::jsonb,
  -- When the case engine accepted this receipt; null means it still needs registering.
  add column engine_registered_at timestamptz,
  -- The last status we emailed about, so a retried update never sends twice.
  add column alerted_status text;

comment on column public.cases.status_description is 'USCIS description of the current status.';
comment on column public.cases.status_history is 'USCIS status history: [{date, completedText}].';
comment on column public.cases.engine_registered_at is 'When the status checker accepted this receipt. Server only.';
comment on column public.cases.alerted_status is 'Last status emailed to the person. Server only.';

create index cases_unregistered_idx on public.cases (user_id) where engine_registered_at is null;
