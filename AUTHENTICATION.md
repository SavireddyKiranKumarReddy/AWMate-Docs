# Authentication

AWMate uses Google sign-in through Supabase. Public pages and downloads stay open; approved accounts
can enter the protected account area. See [`SUPABASE_SETUP.md`](./SUPABASE_SETUP.md) for the complete
Google OAuth, allowlist, RLS, quota, usage, audit, and deployment process.

Never store a Google Client Secret or Supabase service-role key in this repository.
