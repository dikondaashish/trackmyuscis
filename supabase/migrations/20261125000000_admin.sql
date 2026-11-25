-- Admin area (/admin): who is an admin, and a log of every change an admin makes.
--
-- Both tables are server-only like lawyer_applications: row-level security is on with no
-- policies, so the public and signed-in keys can't read or write them. Nobody can make
-- themselves an admin from the site; an admin is added by running SQL in the Supabase
-- dashboard (see docs/admin.md). The admin pages also require two-step sign-in.

create table public.admins (
  user_id uuid primary key references auth.users (id) on delete cascade,
  created_at timestamptz not null default now()
);

comment on table public.admins is 'Accounts that may open /admin. Added by hand in the SQL editor only.';

create table public.admin_audit (
  id bigint generated always as identity primary key,
  created_at timestamptz not null default now(),
  admin_id uuid references auth.users (id) on delete set null,
  -- For example lawyer.listed, lawyer.rejected, review.published.
  action text not null constraint admin_audit_action check (action ~ '^[a-z_]+\.[a-z_]+$'),
  target_type text not null constraint admin_audit_target_type check (target_type in ('lawyer', 'review')),
  target_id uuid,
  -- What changed, kept short: a status, a reason, the fields edited. Never document contents.
  details jsonb not null default '{}'::jsonb
);

comment on table public.admin_audit is 'Every change made from /admin: who, what and when.';

create index admin_audit_created_at on public.admin_audit (created_at desc);
create index admin_audit_target on public.admin_audit (target_type, target_id, created_at desc);

alter table public.admins enable row level security;
alter table public.admin_audit enable row level security;
revoke all on public.admins from anon, authenticated;
revoke all on public.admin_audit from anon, authenticated;
