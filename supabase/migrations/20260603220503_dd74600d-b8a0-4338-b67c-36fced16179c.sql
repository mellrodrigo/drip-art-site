revoke execute on function public.has_role(uuid, app_role) from public;
revoke execute on function public.handle_new_user_role() from public;
revoke execute on function public.set_updated_at() from public;
grant execute on function public.has_role(uuid, app_role) to authenticated, service_role;