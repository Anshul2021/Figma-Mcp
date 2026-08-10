-- ══════════════════════════════════════════════════════════════
-- Morph — Supabase Setup (run once in the SQL editor)
--
-- Paste this file into Supabase → SQL → New query and click Run.
--
-- Creates:
--   1. `users` table          — user registry (id, name, ip, usage,
--                               first/last seen) used for daily rate
--                               limiting per IP + per Gemini model.
--   2. `bump_usage` function  — atomically consumes one daily credit for
--                               a model (row-locked so concurrent
--                               generations cannot over-spend).
--
-- The server writes through the service_role key, which bypasses RLS, so
-- the table stays locked down for the anon/public key.
-- ══════════════════════════════════════════════════════════════

-- 1. Users table
create table if not exists public.users (
  id uuid primary key default gen_random_uuid(),
  ip text not null unique,
  name text,
  usage jsonb not null default '{}'::jsonb,
  first_seen timestamptz not null default now(),
  last_seen timestamptz not null default now(),
  created_at timestamptz not null default now()
);

-- Lock the table down for anon/public keys (service_role still bypasses).
alter table public.users enable row level security;

-- 2. Atomic daily credit consumption
create or replace function public.bump_usage(
  p_ip text,
  p_day text,
  p_model text,
  p_limit int
) returns jsonb
language plpgsql
as $$
declare
  current_used int;
  new_used int;
begin
  insert into public.users (ip, usage)
  values (p_ip, '{}'::jsonb)
  on conflict (ip) do nothing;

  select coalesce((usage #>> array[p_day, p_model])::int, 0)
    into current_used
    from public.users
    where ip = p_ip
    for update;

  if current_used >= p_limit then
    return jsonb_build_object(
      'success', false,
      'remaining', greatest(0, p_limit - current_used),
      'used', current_used
    );
  end if;

  new_used := current_used + 1;

  update public.users
    set usage = jsonb_set(
      coalesce(usage, '{}'::jsonb),
      array[p_day, p_model],
      to_jsonb(new_used),
      true
    )
  where ip = p_ip;

  return jsonb_build_object(
    'success', true,
    'remaining', greatest(0, p_limit - new_used),
    'used', new_used
  );
end;
$$;

-- Allow the server's service_role key to call it.
grant execute on function public.bump_usage(text, text, text, int) to service_role;
