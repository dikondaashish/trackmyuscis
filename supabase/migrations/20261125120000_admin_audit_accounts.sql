-- Admin actions on an account (for example "Check cases now") are logged too.
alter table public.admin_audit drop constraint admin_audit_target_type;
alter table public.admin_audit add constraint admin_audit_target_type check (target_type in ('lawyer', 'review', 'account'));
