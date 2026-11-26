-- Why an admin rejected a review. Private: the table is server-only (no anon or authenticated access).
alter table public.lawyer_reviews
  add column admin_note text constraint lawyer_reviews_admin_note check (char_length(admin_note) <= 1000);
