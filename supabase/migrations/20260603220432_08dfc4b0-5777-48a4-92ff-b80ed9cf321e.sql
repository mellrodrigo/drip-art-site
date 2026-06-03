-- Roles enum and table
create type public.app_role as enum ('admin', 'user');

create table public.user_roles (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete cascade not null,
  role app_role not null,
  created_at timestamptz not null default now(),
  unique (user_id, role)
);

grant select on public.user_roles to authenticated;
grant all on public.user_roles to service_role;

alter table public.user_roles enable row level security;

create or replace function public.has_role(_user_id uuid, _role app_role)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1 from public.user_roles
    where user_id = _user_id and role = _role
  )
$$;

create policy "Users can view their own roles"
on public.user_roles for select to authenticated
using (auth.uid() = user_id);

-- Auto-assign admin role to first user, otherwise user role
create or replace function public.handle_new_user_role()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  if (select count(*) from public.user_roles where role = 'admin') = 0 then
    insert into public.user_roles (user_id, role) values (new.id, 'admin');
  else
    insert into public.user_roles (user_id, role) values (new.id, 'user');
  end if;
  return new;
end;
$$;

create trigger on_auth_user_created_role
after insert on auth.users
for each row execute function public.handle_new_user_role();

-- Gallery photos table
create table public.gallery_photos (
  id uuid primary key default gen_random_uuid(),
  title text,
  category text,
  storage_path text not null,
  public_url text not null,
  sort_order int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

grant select on public.gallery_photos to anon, authenticated;
grant all on public.gallery_photos to service_role;
grant insert, update, delete on public.gallery_photos to authenticated;

alter table public.gallery_photos enable row level security;

create policy "Anyone can view gallery photos"
on public.gallery_photos for select to anon, authenticated
using (true);

create policy "Admins can insert photos"
on public.gallery_photos for insert to authenticated
with check (public.has_role(auth.uid(), 'admin'));

create policy "Admins can update photos"
on public.gallery_photos for update to authenticated
using (public.has_role(auth.uid(), 'admin'));

create policy "Admins can delete photos"
on public.gallery_photos for delete to authenticated
using (public.has_role(auth.uid(), 'admin'));

-- updated_at trigger
create or replace function public.set_updated_at()
returns trigger
language plpgsql
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger gallery_photos_updated_at
before update on public.gallery_photos
for each row execute function public.set_updated_at();
