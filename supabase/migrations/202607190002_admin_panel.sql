-- Seed the primary AWMate owner and add indexes used by the admin dashboard.

insert into public.access_grants (email, role, status, approved_at)
values ('kiransavireddy@gmail.com', 'owner', 'active', now())
on conflict (email) do update set
  role = 'owner',
  status = 'active',
  expires_at = null,
  approved_at = coalesce(public.access_grants.approved_at, now()),
  updated_at = now();

create index if not exists access_grants_role_status_idx
  on public.access_grants(role, status);

create index if not exists access_grants_created_at_idx
  on public.access_grants(created_at desc);
