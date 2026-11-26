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

- **Overview**: what's waiting, totals and the latest changes (in plain words, with the lawyer's
  name or the account's email).
- **Lawyers**: new applications first. Open one, look up the license (attorneys: the state bar's
  lawyer search; representatives: the DOJ roster), then **Approve and list**. Listing records
  today as the license-check date, shows the profile on the site at once and, when email is set
  up, tells the lawyer. **Reject** asks for a private reason. **Unlist** hides a live profile.
  You can also edit the profile, replace the photo and keep private notes. The search box finds
  any application in every status by name, firm, city, state or email (never put in the address);
  the list says when a tab has more than the 500 rows it shows.
- **Reviews**: publish a review if it follows the review rules on `/advertising#reviews`, even
  when it is negative; reject only rule-breakers. A red line warns when the reviewer's account
  uses the lawyer's own email. **Reject** asks which rule it breaks; the reason is private and is
  shown on the Rejected tab. A lawyer's page links to only that lawyer's reviews.
- **Case checks**: whether the daily case checker is working. The page asks the checker itself
  when it last checked (our own copy only updates when a status changes or the person opens their
  dashboard, so it looks old even when checks run fine). A warning shows when the checker didn't
  answer, hasn't checked anything for 48 hours, or status changes weren't emailed. Three lists
  show cases that need a look: not accepted by the checker after 6 hours, USCIS doesn't know the
  number, and checks stopped. Each links to the account.
- **Accounts**: the newest sign-ups, and a search by email, name, username, receipt number or
  account ID (the search is never put in the address). An account shows how they sign in, plan,
  email settings and saved cases with what the checker knows about each. **Check cases now**
  asks the checker to register and refresh that account's cases. How to delete an account is
  written at the bottom of the page.
- **License rechecks**: a listed lawyer is due once their license was last checked over a year
  ago. The overview counts them; Lawyers > Listed > "Show only rechecks due" lists them.

Every change is written to `public.admin_audit` (who, what, when) and shown in History on each
lawyer and on the overview.

## Lost the authenticator app

Another admin, or the Supabase dashboard (Authentication > Users > the user > remove the MFA
factor), can reset it. The next visit to `/admin` shows the set-up QR code again.
