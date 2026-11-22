-- Documents: each person's immigration documents in a private storage bucket, with the
-- details AI reads from them (type, dates, key fields), expiry reminders, and a 6-digit
-- passcode lock. The lock is enforced here: while a person has no unlocked session, the
-- database and storage refuse to show their documents.

-- ── Passcode lock ──────────────────────────────────────────────────────────────────────
-- Nobody reads or writes these tables directly; the functions below do it.

create table public.document_passcodes (
  user_id uuid primary key references auth.users (id) on delete cascade,
  passcode_hash text not null,
  failed_attempts smallint not null default 0,
  locked_until timestamptz,
  auto_lock_minutes smallint not null default 5 check (auto_lock_minutes in (0, 5, 15, 30, 60)),
  lockout_minutes smallint not null default 10 check (lockout_minutes in (1, 2, 3, 5, 10, 15, 30)),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- One row per unlocked browser. The browser keeps the token in an httpOnly cookie; only its
-- SHA-256 is stored.
create table public.document_vault_sessions (
  token_hash text primary key,
  user_id uuid not null references auth.users (id) on delete cascade,
  expires_at timestamptz not null,
  created_at timestamptz not null default now()
);
create index document_vault_sessions_user_idx on public.document_vault_sessions (user_id, expires_at);

-- Emailed 6-digit codes for changing a passcode or resetting a forgotten one.
create table public.document_passcode_codes (
  user_id uuid not null references auth.users (id) on delete cascade,
  purpose text not null check (purpose in ('change', 'forgot')),
  code_hash text not null,
  new_passcode_hash text,
  expires_at timestamptz not null,
  attempts smallint not null default 0,
  locked_until timestamptz,
  created_at timestamptz not null default now(),
  primary key (user_id, purpose)
);

alter table public.document_passcodes enable row level security;
alter table public.document_vault_sessions enable row level security;
alter table public.document_passcode_codes enable row level security;
revoke all on public.document_passcodes, public.document_vault_sessions, public.document_passcode_codes from anon, authenticated;

-- Is this person's vault unlocked in some browser? Used by the row-level policies.
create function public.document_vault_unlocked()
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select exists (
    select 1 from public.document_vault_sessions s
    where s.user_id = (select auth.uid()) and s.expires_at > now()
  );
$$;

-- Whether a passcode is set, any lockout, and the lock settings.
create function public.document_vault_status()
returns json
language sql
stable
security definer
set search_path = ''
as $$
  select json_build_object(
    'has_passcode', p.user_id is not null,
    'locked_until', case when p.locked_until > now() then p.locked_until end,
    'auto_lock_minutes', coalesce(p.auto_lock_minutes, 5),
    'lockout_minutes', coalesce(p.lockout_minutes, 10)
  )
  from (select 1) one
  left join public.document_passcodes p on p.user_id = (select auth.uid());
$$;

-- First passcode. Changing it later goes through an emailed code.
create function public.document_vault_setup(p_passcode text)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  if p_passcode is null or p_passcode !~ '^\d{6}$' then raise exception 'passcode_format'; end if;
  if exists (select 1 from public.document_passcodes where user_id = auth.uid()) then
    raise exception 'passcode_exists';
  end if;
  insert into public.document_passcodes (user_id, passcode_hash)
  values (auth.uid(), extensions.crypt(p_passcode, extensions.gen_salt('bf', 10)));
end;
$$;

-- Checks a passcode against the person's own, counting wrong tries: 3 in a row lock it for
-- lockout_minutes. Returns {ok} or {ok:false, error, remaining | locked_until}.
create function public.document_vault_check_passcode(p_passcode text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  r public.document_passcodes;
  tries smallint;
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into r from public.document_passcodes where user_id = auth.uid() for update;
  if not found then return json_build_object('ok', false, 'error', 'no_passcode'); end if;
  if r.locked_until > now() then
    return json_build_object('ok', false, 'error', 'locked', 'locked_until', r.locked_until);
  end if;
  if p_passcode is not null and p_passcode ~ '^\d{6}$'
     and r.passcode_hash = extensions.crypt(p_passcode, r.passcode_hash) then
    update public.document_passcodes
      set failed_attempts = 0, locked_until = null, updated_at = now()
      where user_id = auth.uid();
    return json_build_object('ok', true);
  end if;
  -- A lockout that has run out starts the count again.
  tries := case when r.locked_until is not null then 1 else r.failed_attempts + 1 end;
  if tries >= 3 then
    update public.document_passcodes
      set failed_attempts = tries, locked_until = now() + make_interval(mins => r.lockout_minutes), updated_at = now()
      where user_id = auth.uid();
    return json_build_object('ok', false, 'error', 'locked', 'locked_until', now() + make_interval(mins => r.lockout_minutes));
  end if;
  update public.document_passcodes
    set failed_attempts = tries, locked_until = null, updated_at = now()
    where user_id = auth.uid();
  return json_build_object('ok', false, 'error', 'wrong', 'remaining', 3 - tries);
end;
$$;

-- Unlock: checks the passcode and, when right, starts a 12-hour session and returns its token.
create function public.document_vault_unlock(p_passcode text)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  result json;
  token text;
begin
  result := public.document_vault_check_passcode(p_passcode);
  if not (result ->> 'ok')::boolean then return result; end if;
  delete from public.document_vault_sessions where user_id = auth.uid() and expires_at <= now();
  token := encode(extensions.gen_random_bytes(32), 'hex');
  insert into public.document_vault_sessions (token_hash, user_id, expires_at)
  values (encode(extensions.digest(token, 'sha256'), 'hex'), auth.uid(), now() + interval '12 hours');
  return json_build_object('ok', true, 'token', token);
end;
$$;

-- Is this browser's session (its cookie token) still unlocked?
create function public.document_vault_session_valid(p_token text)
returns boolean
language sql
stable
security definer
set search_path = ''
as $$
  select p_token is not null and exists (
    select 1 from public.document_vault_sessions s
    where s.token_hash = encode(extensions.digest(p_token, 'sha256'), 'hex')
      and s.user_id = (select auth.uid())
      and s.expires_at > now()
  );
$$;

-- Lock this browser again.
create function public.document_vault_lock(p_token text)
returns void
language sql
security definer
set search_path = ''
as $$
  delete from public.document_vault_sessions
  where token_hash = encode(extensions.digest(coalesce(p_token, ''), 'sha256'), 'hex')
    and user_id = (select auth.uid());
$$;

create function public.document_vault_settings(p_auto_lock_minutes smallint, p_lockout_minutes smallint)
returns void
language plpgsql
security definer
set search_path = ''
as $$
begin
  update public.document_passcodes
    set auto_lock_minutes = coalesce(p_auto_lock_minutes, auto_lock_minutes),
        lockout_minutes = coalesce(p_lockout_minutes, lockout_minutes),
        updated_at = now()
    where user_id = auth.uid();
  if not found then raise exception 'no_passcode'; end if;
end;
$$;

-- Server only (secret key): makes a 6-digit code for a person, to send by email. One code per
-- purpose at a time, at most one a minute, valid for 10 minutes.
create function public.document_passcode_issue_code(p_user_id uuid, p_purpose text, p_new_passcode text default null)
returns text
language plpgsql
security definer
set search_path = ''
as $$
declare
  existing public.document_passcode_codes;
  code text;
begin
  if p_purpose not in ('change', 'forgot') then raise exception 'purpose'; end if;
  if p_new_passcode is not null and p_new_passcode !~ '^\d{6}$' then raise exception 'passcode_format'; end if;
  select * into existing from public.document_passcode_codes where user_id = p_user_id and purpose = p_purpose;
  if found and existing.locked_until > now() then raise exception 'code_locked'; end if;
  if found and existing.created_at > now() - interval '1 minute' then raise exception 'code_too_soon'; end if;
  code := lpad((abs(('x' || encode(extensions.gen_random_bytes(4), 'hex'))::bit(32)::bigint) % 1000000)::text, 6, '0');
  insert into public.document_passcode_codes (user_id, purpose, code_hash, new_passcode_hash, expires_at)
  values (
    p_user_id, p_purpose,
    extensions.crypt(code, extensions.gen_salt('bf', 8)),
    case when p_new_passcode is not null then extensions.crypt(p_new_passcode, extensions.gen_salt('bf', 10)) end,
    now() + interval '10 minutes'
  )
  on conflict (user_id, purpose) do update set
    code_hash = excluded.code_hash,
    new_passcode_hash = excluded.new_passcode_hash,
    expires_at = excluded.expires_at,
    attempts = 0,
    locked_until = null,
    created_at = now();
  return code;
end;
$$;

-- Confirms an emailed code. 'change' sets the new passcode chosen when the code was sent.
-- 'forgot' sets p_new_passcode and, by design, removes every document (the passcode guards
-- them, so whoever resets it must not see the old ones): it returns their storage paths so
-- the server can delete the files. 5 wrong codes lock it for 15 minutes.
create function public.document_passcode_confirm_code(p_purpose text, p_code text, p_new_passcode text default null)
returns json
language plpgsql
security definer
set search_path = ''
as $$
declare
  c public.document_passcode_codes;
  paths text[];
begin
  if auth.uid() is null then raise exception 'not_signed_in'; end if;
  select * into c from public.document_passcode_codes where user_id = auth.uid() and purpose = p_purpose for update;
  if not found then return json_build_object('ok', false, 'error', 'no_code'); end if;
  if c.locked_until > now() then return json_build_object('ok', false, 'error', 'locked', 'locked_until', c.locked_until); end if;
  if c.expires_at <= now() then
    delete from public.document_passcode_codes where user_id = auth.uid() and purpose = p_purpose;
    return json_build_object('ok', false, 'error', 'expired');
  end if;
  if p_code is null or p_code !~ '^\d{6}$' or c.code_hash <> extensions.crypt(p_code, c.code_hash) then
    update public.document_passcode_codes
      set attempts = c.attempts + 1,
          locked_until = case when c.attempts + 1 >= 5 then now() + interval '15 minutes' end
      where user_id = auth.uid() and purpose = p_purpose;
    return json_build_object('ok', false, 'error', case when c.attempts + 1 >= 5 then 'locked' else 'wrong' end);
  end if;

  if p_purpose = 'change' then
    update public.document_passcodes
      set passcode_hash = c.new_passcode_hash, failed_attempts = 0, locked_until = null, updated_at = now()
      where user_id = auth.uid();
    delete from public.document_passcode_codes where user_id = auth.uid() and purpose = p_purpose;
    return json_build_object('ok', true);
  end if;

  if p_new_passcode is null or p_new_passcode !~ '^\d{6}$' then
    return json_build_object('ok', false, 'error', 'passcode_format');
  end if;
  select coalesce(array_agg(storage_path), '{}') into paths from public.documents where user_id = auth.uid();
  delete from public.documents where user_id = auth.uid();
  delete from public.document_vault_sessions where user_id = auth.uid();
  insert into public.document_passcodes (user_id, passcode_hash)
  values (auth.uid(), extensions.crypt(p_new_passcode, extensions.gen_salt('bf', 10)))
  on conflict (user_id) do update set
    passcode_hash = excluded.passcode_hash, failed_attempts = 0, locked_until = null, updated_at = now();
  delete from public.document_passcode_codes where user_id = auth.uid() and purpose = p_purpose;
  return json_build_object('ok', true, 'removed_paths', to_json(paths));
end;
$$;

revoke all on function public.document_passcode_issue_code(uuid, text, text) from public, anon, authenticated;
grant execute on function public.document_passcode_issue_code(uuid, text, text) to service_role;
revoke all on function public.document_vault_unlocked(), public.document_vault_status(), public.document_vault_setup(text),
  public.document_vault_check_passcode(text), public.document_vault_unlock(text), public.document_vault_session_valid(text),
  public.document_vault_lock(text), public.document_vault_settings(smallint, smallint),
  public.document_passcode_confirm_code(text, text, text) from public, anon;
grant execute on function public.document_vault_unlocked(), public.document_vault_status(), public.document_vault_setup(text),
  public.document_vault_check_passcode(text), public.document_vault_unlock(text), public.document_vault_session_valid(text),
  public.document_vault_lock(text), public.document_vault_settings(smallint, smallint),
  public.document_passcode_confirm_code(text, text, text) to authenticated;

-- ── Documents ──────────────────────────────────────────────────────────────────────────

create table public.documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users (id) on delete cascade,
  filename text not null check (char_length(filename) between 1 and 255),
  storage_path text not null unique,
  file_type text not null check (file_type in ('application/pdf', 'image/jpeg', 'image/png', 'image/webp')),
  file_size integer not null check (file_size between 1 and 10485760),
  -- A known type (passport, green_card…) or one the person typed, in snake_case.
  category text not null default 'other' check (category ~ '^[a-z0-9_]{1,40}$'),
  issue_date date,
  expiry_date date,
  summary text check (char_length(summary) <= 1000),
  extracted_fields jsonb not null default '{}'::jsonb check (jsonb_typeof(extracted_fields) = 'object'),
  ai_confidence smallint check (ai_confidence between 0 and 100),
  -- The last reminder sent (60, 45, 30, 20, 10, 5 or 0 days before expiry). Cleared when the
  -- expiry date changes.
  reminded_days smallint,
  uploaded_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (split_part(storage_path, '/', 1) = user_id::text)
);
create index documents_user_idx on public.documents (user_id, uploaded_at desc);
create index documents_expiry_idx on public.documents (expiry_date) where expiry_date is not null;
comment on table public.documents is 'Each person''s uploaded immigration documents; files live in the private documents bucket.';

create function public.documents_before_write()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  if tg_op = 'INSERT' then
    -- 20 uploads per person in any 24 hours.
    if (select count(*) from public.documents
        where user_id = new.user_id and uploaded_at > now() - interval '1 day') >= 20 then
      raise exception 'daily_upload_limit' using hint = 'daily_upload_limit';
    end if;
    return new;
  end if;
  new.updated_at := now();
  if new.expiry_date is distinct from old.expiry_date then new.reminded_days := null; end if;
  return new;
end;
$$;
create trigger documents_before_write before insert or update on public.documents
  for each row execute function public.documents_before_write();

alter table public.documents enable row level security;
create policy "Owners see their documents while unlocked" on public.documents
  for select to authenticated using (user_id = (select auth.uid()) and public.document_vault_unlocked());
create policy "Owners add documents while unlocked" on public.documents
  for insert to authenticated with check (user_id = (select auth.uid()) and public.document_vault_unlocked());
create policy "Owners edit documents while unlocked" on public.documents
  for update to authenticated
  using (user_id = (select auth.uid()) and public.document_vault_unlocked())
  with check (user_id = (select auth.uid()));
create policy "Owners delete documents while unlocked" on public.documents
  for delete to authenticated using (user_id = (select auth.uid()) and public.document_vault_unlocked());

revoke all on public.documents from anon, authenticated;
grant select, delete on public.documents to authenticated;
grant insert (user_id, filename, storage_path, file_type, file_size, category, issue_date, expiry_date, summary,
  extracted_fields, ai_confidence) on public.documents to authenticated;
grant update (category, issue_date, expiry_date) on public.documents to authenticated;

-- ── Storage: private bucket, one folder per person ─────────────────────────────────────

insert into storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
values ('documents', 'documents', false, 10485760, array['application/pdf', 'image/jpeg', 'image/png', 'image/webp']);

create policy "Owners read their document files while unlocked" on storage.objects
  for select to authenticated using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text and public.document_vault_unlocked()
  );
create policy "Owners upload document files while unlocked" on storage.objects
  for insert to authenticated with check (
    bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text and public.document_vault_unlocked()
  );
create policy "Owners delete their document files while unlocked" on storage.objects
  for delete to authenticated using (
    bucket_id = 'documents' and (storage.foldername(name))[1] = (select auth.uid())::text and public.document_vault_unlocked()
  );

-- ── Reminder emails preference ─────────────────────────────────────────────────────────

alter table public.profiles add column document_reminders boolean not null default true;
grant insert (document_reminders), update (document_reminders) on public.profiles to authenticated;
comment on column public.profiles.document_reminders is 'Email before a saved document expires (60, 45, 30, 20, 10 and 5 days, and on the day).';
