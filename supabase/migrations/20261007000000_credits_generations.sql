-- Fase 1: ledger kredit, hasil generate, aset, batas harian, dan rate limit.
-- Semua penulisan berjalan di server lewat service role (lib/credits, lib/generations).
-- Klien hanya boleh membaca barisnya sendiri, plus menghapus hasilnya sendiri.

-- ---------------------------------------------------------------------------
-- credit_ledger: hanya tambah baris; saldo = jumlah semua delta.
-- ---------------------------------------------------------------------------
create table public.credit_ledger (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  delta integer not null check (delta <> 0),
  reason text not null check (reason in ('signup_bonus', 'topup', 'spend', 'refund', 'admin')),
  ref_id text,
  created_at timestamptz not null default now()
);

create index credit_ledger_user_created_idx on public.credit_ledger (user_id, created_at desc);

-- Satu bonus daftar per pengguna.
create unique index credit_ledger_signup_bonus_once
  on public.credit_ledger (user_id) where reason = 'signup_bonus';

-- Idempotensi: satu spend / refund / topup per ref_id (mis. generation_id, provider_ref).
create unique index credit_ledger_reason_ref_once
  on public.credit_ledger (reason, ref_id)
  where ref_id is not null and reason in ('spend', 'refund', 'topup');

alter table public.credit_ledger enable row level security;

create policy "credit_ledger_select_own"
  on public.credit_ledger for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.credit_ledger from anon, authenticated;
grant select on table public.credit_ledger to authenticated;

-- ---------------------------------------------------------------------------
-- generations: satu baris per permintaan generate.
-- ---------------------------------------------------------------------------
create table public.generations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  module text not null check (module in ('konten', 'listing', 'klip', 'halaman', 'prd')),
  title text not null default '' check (char_length(title) <= 200),
  input jsonb not null,
  output jsonb,
  status text not null default 'queued' check (status in ('queued', 'done', 'failed')),
  cost_credits integer not null default 0 check (cost_credits >= 0),
  error_code text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index generations_user_created_idx on public.generations (user_id, created_at desc);
create index generations_user_module_created_idx
  on public.generations (user_id, module, created_at desc);

alter table public.generations enable row level security;

create policy "generations_select_own"
  on public.generations for select
  to authenticated
  using ((select auth.uid()) = user_id);

create policy "generations_delete_own"
  on public.generations for delete
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.generations from anon, authenticated;
grant select, delete on table public.generations to authenticated;

-- ---------------------------------------------------------------------------
-- assets: file hasil (gambar, HTML) di Storage. Dipakai mulai Fase 2.
-- ---------------------------------------------------------------------------
create table public.assets (
  id uuid primary key default gen_random_uuid(),
  generation_id uuid not null references public.generations (id) on delete cascade,
  user_id uuid not null references auth.users (id) on delete cascade,
  storage_path text not null,
  kind text not null check (kind in ('image', 'image_preview', 'html')),
  created_at timestamptz not null default now()
);

create index assets_generation_idx on public.assets (generation_id);

alter table public.assets enable row level security;

create policy "assets_select_own"
  on public.assets for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.assets from anon, authenticated;
grant select on table public.assets to authenticated;

-- ---------------------------------------------------------------------------
-- usage_limits: hitungan harian per modul (PRD Mini, preview gambar).
-- Hari dihitung dalam zona waktu Asia/Jakarta.
-- ---------------------------------------------------------------------------
create table public.usage_limits (
  user_id uuid not null references auth.users (id) on delete cascade,
  module text not null,
  day date not null,
  count integer not null default 0 check (count >= 0),
  primary key (user_id, module, day)
);

alter table public.usage_limits enable row level security;

create policy "usage_limits_select_own"
  on public.usage_limits for select
  to authenticated
  using ((select auth.uid()) = user_id);

revoke all on table public.usage_limits from anon, authenticated;
grant select on table public.usage_limits to authenticated;

-- ---------------------------------------------------------------------------
-- rate_limit_hits: jendela tetap per pengguna dan bucket. Hanya server.
-- ---------------------------------------------------------------------------
create table public.rate_limit_hits (
  user_id uuid not null references auth.users (id) on delete cascade,
  bucket text not null,
  window_start timestamptz not null,
  count integer not null default 0,
  primary key (user_id, bucket, window_start)
);

alter table public.rate_limit_hits enable row level security;
-- Tanpa policy: anon dan authenticated tidak bisa membaca atau menulis.
revoke all on table public.rate_limit_hits from anon, authenticated;

-- ---------------------------------------------------------------------------
-- Fungsi. Semua security definer, hanya bisa dipanggil service role.
-- ---------------------------------------------------------------------------

create function public.app_today()
returns date
language sql
stable
set search_path = ''
as $$
  select (now() at time zone 'Asia/Jakarta')::date;
$$;

create function public.credits_balance(p_user uuid)
returns integer
language sql
stable
security definer
set search_path = ''
as $$
  select coalesce(sum(delta), 0)::integer from public.credit_ledger where user_id = p_user;
$$;

-- Bonus daftar; aman dipanggil berulang. true bila baris baru ditulis.
create function public.credits_grant_signup_bonus(p_user uuid, p_amount integer)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_rows integer;
begin
  if p_amount <= 0 then
    raise exception 'invalid_amount' using errcode = '22023';
  end if;
  insert into public.credit_ledger (user_id, delta, reason)
  values (p_user, p_amount, 'signup_bonus')
  on conflict do nothing;
  get diagnostics v_rows = row_count;
  return v_rows > 0;
end;
$$;

-- Potong kredit dalam satu transaksi: kunci per pengguna, cek saldo, tulis baris negatif.
-- Idempoten per p_ref: panggilan kedua dengan ref yang sama tidak memotong lagi.
-- Hasil: status = 'spent' | 'already_spent' | 'insufficient', plus saldo terbaru.
create function public.credits_spend(p_user uuid, p_amount integer, p_ref text)
returns table (status text, balance integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_balance integer;
begin
  if p_amount <= 0 then
    raise exception 'invalid_amount' using errcode = '22023';
  end if;
  if p_ref is null or p_ref = '' then
    raise exception 'missing_ref' using errcode = '22023';
  end if;

  -- Serialisasi semua perubahan saldo satu pengguna.
  perform pg_advisory_xact_lock(hashtextextended('credits:' || p_user::text, 0));

  select coalesce(sum(delta), 0)::integer into v_balance
  from public.credit_ledger where user_id = p_user;

  if exists (
    select 1 from public.credit_ledger
    where reason = 'spend' and ref_id = p_ref and user_id = p_user
  ) then
    return query select 'already_spent'::text, v_balance;
    return;
  end if;

  if v_balance < p_amount then
    return query select 'insufficient'::text, v_balance;
    return;
  end if;

  insert into public.credit_ledger (user_id, delta, reason, ref_id)
  values (p_user, -p_amount, 'spend', p_ref);

  return query select 'spent'::text, v_balance - p_amount;
end;
$$;

-- Kembalikan kredit dari spend dengan ref yang sama. Idempoten.
-- Hasil: status = 'refunded' | 'already_refunded' | 'not_found', plus saldo terbaru.
create function public.credits_refund(p_user uuid, p_ref text)
returns table (status text, balance integer)
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_spent integer;
begin
  perform pg_advisory_xact_lock(hashtextextended('credits:' || p_user::text, 0));

  select -delta into v_spent
  from public.credit_ledger
  where reason = 'spend' and ref_id = p_ref and user_id = p_user;

  if v_spent is null then
    return query select 'not_found'::text, public.credits_balance(p_user);
    return;
  end if;

  if exists (
    select 1 from public.credit_ledger
    where reason = 'refund' and ref_id = p_ref and user_id = p_user
  ) then
    return query select 'already_refunded'::text, public.credits_balance(p_user);
    return;
  end if;

  insert into public.credit_ledger (user_id, delta, reason, ref_id)
  values (p_user, v_spent, 'refund', p_ref);

  return query select 'refunded'::text, public.credits_balance(p_user);
end;
$$;

-- Ambil satu kuota harian bila masih tersedia. Mengembalikan hitungan baru, atau null bila habis.
create function public.usage_consume(p_user uuid, p_module text, p_limit integer)
returns integer
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_count integer;
begin
  insert into public.usage_limits as u (user_id, module, day, count)
  values (p_user, p_module, public.app_today(), 1)
  on conflict (user_id, module, day)
    do update set count = u.count + 1
    where u.count < p_limit
  returning u.count into v_count;
  return v_count;
end;
$$;

-- Kembalikan satu kuota hari ini (dipakai saat generate gagal).
create function public.usage_release(p_user uuid, p_module text)
returns void
language sql
security definer
set search_path = ''
as $$
  update public.usage_limits
  set count = count - 1
  where user_id = p_user and module = p_module and day = public.app_today() and count > 0;
$$;

-- Rate limit jendela tetap. true bila permintaan diizinkan.
create function public.rate_limit_hit(
  p_user uuid,
  p_bucket text,
  p_window_seconds integer,
  p_max integer
)
returns boolean
language plpgsql
security definer
set search_path = ''
as $$
declare
  v_window timestamptz;
  v_count integer;
begin
  v_window := to_timestamp(floor(extract(epoch from now()) / p_window_seconds) * p_window_seconds);

  -- Bersihkan jendela lama milik pengguna ini agar tabel tetap kecil.
  delete from public.rate_limit_hits
  where user_id = p_user and bucket = p_bucket and window_start < v_window;

  insert into public.rate_limit_hits as r (user_id, bucket, window_start, count)
  values (p_user, p_bucket, v_window, 1)
  on conflict (user_id, bucket, window_start)
    do update set count = r.count + 1
  returning r.count into v_count;

  return v_count <= p_max;
end;
$$;

revoke execute on function public.app_today() from public, anon, authenticated;
revoke execute on function public.credits_balance(uuid) from public, anon, authenticated;
revoke execute on function public.credits_grant_signup_bonus(uuid, integer) from public, anon, authenticated;
revoke execute on function public.credits_spend(uuid, integer, text) from public, anon, authenticated;
revoke execute on function public.credits_refund(uuid, text) from public, anon, authenticated;
revoke execute on function public.usage_consume(uuid, text, integer) from public, anon, authenticated;
revoke execute on function public.usage_release(uuid, text) from public, anon, authenticated;
revoke execute on function public.rate_limit_hit(uuid, text, integer, integer) from public, anon, authenticated;

grant execute on function public.app_today() to service_role;
grant execute on function public.credits_balance(uuid) to service_role;
grant execute on function public.credits_grant_signup_bonus(uuid, integer) to service_role;
grant execute on function public.credits_spend(uuid, integer, text) to service_role;
grant execute on function public.credits_refund(uuid, text) to service_role;
grant execute on function public.usage_consume(uuid, text, integer) to service_role;
grant execute on function public.usage_release(uuid, text) to service_role;
grant execute on function public.rate_limit_hit(uuid, text, integer, integer) to service_role;

-- Server (service role) menulis tabel-tabel ini secara langsung.
grant all on table public.credit_ledger, public.generations, public.assets,
  public.usage_limits, public.rate_limit_hits to service_role;
