# Admin area

`/admin` is where lawyer applications and reviews are managed. Only accounts listed in the
`public.admins` table can open it, and every admin must use two-step sign-in (an authenticator
app). Everyone else gets a 404.

## Add an admin

1. The person creates a normal account on the site (email or Google).
2. In the Supabase SQL editor, run (with their sign-in email):

   ```sql
   insert into public.admins (user_id)
   select id from auth.users where lower(email) = lower('person@example.com');
   ```

   It should say `INSERT 0 1`. `INSERT 0 0` means no account uses that email yet.
3. They open `/admin`, scan the QR code with an authenticator app and enter the code.

To remove an admin: `delete from public.admins where user_id = (select id from auth.users where lower(email) = lower('person@example.com'));`

Never put an admin's email in this repo: it is public.

## Day to day

- **Overview**: what's waiting, totals and the latest changes.
- **Lawyers**: new applications first. Open one, look up the license (attorneys: the state bar's
  lawyer search; representatives: the DOJ roster), then **Approve and list**. Listing records
  today as the license-check date, shows the profile on the site at once and, when email is set
  up, tells the lawyer. **Reject** asks for a private reason. **Unlist** hides a live profile.
  You can also edit the profile, replace the photo and keep private notes.
- **Reviews**: publish a review if it follows the review rules on `/advertising#reviews`, even
  when it is negative; reject only rule-breakers. A red line warns when the reviewer's account
  uses the lawyer's own email.

Every change is written to `public.admin_audit` (who, what, when) and shown in History on each
lawyer and on the overview.

## Lost the authenticator app

Another admin, or the Supabase dashboard (Authentication > Users > the user > remove the MFA
factor), can reset it. The next visit to `/admin` shows the set-up QR code again.
