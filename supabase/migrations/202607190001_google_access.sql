-- AWMate Google access control, usage accounting, and audit foundation.
-- Run this in the Supabase SQL editor or with the Supabase CLI.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  display_name text,
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.access_grants (
  id uuid primary key default gen_random_uuid(),
  user_id uuid unique references auth.users(id) on delete cascade,
  email text not null unique,
  role text not null default 'member' check (role in ('owner', 'admin', 'member', 'auditor')),
  status text not null default 'active' check (status in ('active', 'pending', 'suspended', 'revoked')),
  daily_request_limit integer check (daily_request_limit is null or daily_request_limit >= 0),
  monthly_token_limit bigint check (monthly_token_limit is null or monthly_token_limit >= 0),
  approved_by uuid references auth.users(id) on delete set null,
  approved_at timestamptz,
  expires_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.usage_events (
  id bigint generated always as identity primary key,
  user_id uuid not null references auth.users(id) on delete cascade,
  session_id text,
  event_type text not null,
  requests integer not null default 0 check (requests >= 0),
  input_tokens bigint not null default 0 check (input_tokens >= 0),
  output_tokens bigint not null default 0 check (output_tokens >= 0),
  cost_micros bigint not null default 0 check (cost_micros >= 0),
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create table if not exists public.audit_events (
  id bigint generated always as identity primary key,
  user_id uuid references auth.users(id) on delete set null,
  actor_id uuid references auth.users(id) on delete set null,
  event_type text not null,
  resource_type text,
  resource_id text,
  ip_hash text,
  user_agent text,
  metadata jsonb not null default '{}'::jsonb,
  occurred_at timestamptz not null default now()
);

create index if not exists usage_events_user_time_idx
  on public.usage_events(user_id, occurred_at desc);
create index if not exists audit_events_user_time_idx
  on public.audit_events(user_id, occurred_at desc);
create index if not exists audit_events_actor_time_idx
  on public.audit_events(actor_id, occurred_at desc);

create or replace function public.prepare_access_grant()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  new.email := lower(trim(new.email));
  new.updated_at := now();

  if new.user_id is null then
    select id into new.user_id
    from auth.users
    where lower(email) = new.email
    order by created_at asc
    limit 1;
  end if;

  if new.status = 'active' and new.approved_at is null then
    new.approved_at := now();
  end if;

  return new;
end;
$$;

drop trigger if exists prepare_access_grant_trigger on public.access_grants;
create trigger prepare_access_grant_trigger
before insert or update on public.access_grants
for each row execute function public.prepare_access_grant();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public, auth
as $$
begin
  insert into public.profiles (id, email, display_name, avatar_url)
  values (
    new.id,
    lower(new.email),
    coalesce(new.raw_user_meta_data ->> 'full_name', new.raw_user_meta_data ->> 'name'),
    coalesce(new.raw_user_meta_data ->> 'avatar_url', new.raw_user_meta_data ->> 'picture')
  )
  on conflict (id) do update set
    email = excluded.email,
    display_name = excluded.display_name,
    avatar_url = excluded.avatar_url,
    updated_at = now();

  update public.access_grants
  set user_id = new.id, updated_at = now()
  where user_id is null and email = lower(new.email);

  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert or update of email, raw_user_meta_data on auth.users
for each row execute function public.handle_new_user();

create or replace function public.has_active_access()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.access_grants
    where user_id = auth.uid()
      and status = 'active'
      and (expires_at is null or expires_at > now())
  );
$$;

alter table public.profiles enable row level security;
alter table public.access_grants enable row level security;
alter table public.usage_events enable row level security;
alter table public.audit_events enable row level security;

drop policy if exists "Users can read their profile" on public.profiles;
create policy "Users can read their profile"
on public.profiles for select to authenticated
using (id = auth.uid());

drop policy if exists "Users can update their profile" on public.profiles;
create policy "Users can update their profile"
on public.profiles for update to authenticated
using (id = auth.uid())
with check (id = auth.uid());

drop policy if exists "Users can read their access grant" on public.access_grants;
create policy "Users can read their access grant"
on public.access_grants for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read their usage" on public.usage_events;
create policy "Users can read their usage"
on public.usage_events for select to authenticated
using (user_id = auth.uid());

drop policy if exists "Users can read their audit trail" on public.audit_events;
create policy "Users can read their audit trail"
on public.audit_events for select to authenticated
using (user_id = auth.uid() or actor_id = auth.uid());

-- These tables intentionally have no client write policies. Write trusted usage,
-- audit, and access data from backend code with the service-role key only.
grant execute on function public.has_active_access() to authenticated;

-- Replace the email and run once to create your first owner grant:
-- insert into public.access_grants (email, role, status)
-- values ('owner@gmail.com', 'owner', 'active')
-- on conflict (email) do update set role = 'owner', status = 'active';
