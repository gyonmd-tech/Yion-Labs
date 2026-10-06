-- Fase 0: profil pengguna, dibuat otomatis saat daftar.

create table public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  name text not null default '' check (char_length(name) <= 100),
  role text not null default 'user' check (role in ('user', 'admin')),
  created_at timestamptz not null default now()
);

comment on table public.profiles is 'Satu baris per pengguna auth; role hanya diubah lewat service role atau SQL.';

-- RLS: pengguna hanya membaca dan mengubah barisnya sendiri.
alter table public.profiles enable row level security;

create policy "profiles_select_own"
  on public.profiles for select
  to authenticated
  using ((select auth.uid()) = id);

create policy "profiles_update_own"
  on public.profiles for update
  to authenticated
  using ((select auth.uid()) = id)
  with check ((select auth.uid()) = id);

-- Insert dan delete hanya lewat trigger / cascade, bukan dari klien.
-- Dari klien hanya kolom name yang boleh diubah; role tidak.
revoke all on table public.profiles from anon, authenticated;
grant select on table public.profiles to authenticated;
grant update (name) on table public.profiles to authenticated;

-- Trigger: buat profil saat baris baru masuk ke auth.users.
create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, name)
  values (
    new.id,
    left(
      coalesce(
        nullif(trim(new.raw_user_meta_data ->> 'full_name'), ''),
        nullif(trim(new.raw_user_meta_data ->> 'name'), ''),
        ''
      ),
      100
    )
  );
  return new;
end;
$$;

revoke execute on function public.handle_new_user() from public, anon, authenticated;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
