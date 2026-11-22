-- App preferences people set in Settings > Preferences. Email alerts are on by default and
-- start when automatic status checks launch. Profile visibility and activity status are off
-- by default; nothing is shown to other people until community features launch.

alter table public.profiles
  add column email_notifications boolean not null default true,
  add column public_profile boolean not null default false,
  add column show_activity_status boolean not null default false;

comment on column public.profiles.email_notifications is 'Email the person when a saved case status changes.';
comment on column public.profiles.public_profile is 'Let other people see the community profile (when community features launch).';
comment on column public.profiles.show_activity_status is 'Let other people see when the person was last active (when community features launch).';

grant update (email_notifications, public_profile, show_activity_status) on public.profiles to authenticated;
