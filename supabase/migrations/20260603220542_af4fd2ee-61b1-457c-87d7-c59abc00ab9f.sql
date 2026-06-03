create policy "Public can view gallery files"
on storage.objects for select to anon, authenticated
using (bucket_id = 'gallery');

create policy "Admins can upload gallery files"
on storage.objects for insert to authenticated
with check (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can update gallery files"
on storage.objects for update to authenticated
using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete gallery files"
on storage.objects for delete to authenticated
using (bucket_id = 'gallery' and public.has_role(auth.uid(), 'admin'));