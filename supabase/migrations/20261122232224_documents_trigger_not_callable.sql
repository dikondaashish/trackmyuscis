-- The documents trigger runs on its own; nobody needs to call it.
revoke all on function public.documents_before_write() from public, anon, authenticated;
