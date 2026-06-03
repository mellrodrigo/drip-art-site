revoke execute on function public.has_role(uuid, app_role) from anon, authenticated;
revoke execute on function public.handle_new_user_role() from anon, authenticated;
revoke execute on function public.set_updated_at() from anon, authenticated;