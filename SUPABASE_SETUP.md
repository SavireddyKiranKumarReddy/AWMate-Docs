# AWMate Google Login + Supabase Setup

This website uses Supabase Auth for Google login and Supabase Postgres for access control. The
marketing website, documentation, and downloads stay public. `/account` requires an approved Google
account.

## 1. Create and configure Supabase

1. Create a Supabase project.
2. Open **SQL Editor**, paste the full contents of
   `supabase/migrations/202607190001_google_access.sql`, and run it.
3. Open **Project Settings → API** and copy the Project URL and Publishable key.
4. Never copy the `service_role` key into the website, desktop app, GitHub, or a `VITE_` variable.

## 2. Configure Google Cloud

1. Configure the OAuth consent screen for AWMate in Google Cloud Console.
2. Create a **Web application** OAuth 2.0 client.
3. In **Supabase → Authentication → Providers → Google**, copy the callback URL shown for the
   project. It normally looks like:

   `https://YOUR_PROJECT_REF.supabase.co/auth/v1/callback`

4. Add that exact Supabase URL to **Authorized redirect URIs** in the Google OAuth client.
5. Add `https://awmate.nxtgensec.org` to **Authorized JavaScript origins**.
6. Paste the Google Client ID and Client Secret into the Supabase Google provider, enable it, and
   save.

The Google Client Secret belongs only in Supabase. Do not send it in chat and do not commit it.

## 3. Configure Supabase URLs

Open **Supabase → Authentication → URL Configuration** and set:

- Site URL: `https://awmate.nxtgensec.org`
- Redirect URL: `https://awmate.nxtgensec.org/auth/callback`
- Local redirect URLs: `http://localhost:3000/auth/callback` and
  `http://localhost:5173/auth/callback`

## 4. Configure environment variables

Copy `.env.example` to `.env.local` and replace the public values:

```env
VITE_SUPABASE_URL=https://YOUR_PROJECT_REF.supabase.co
VITE_SUPABASE_PUBLISHABLE_KEY=sb_publishable_REPLACE_ME
VITE_SITE_URL=http://localhost:3000
```

Set the same variables in production hosting, with
`VITE_SITE_URL=https://awmate.nxtgensec.org`. The publishable key is safe for browser use; Row Level
Security protects the data.

## 5. Approve accounts

Create your first owner in the Supabase SQL Editor:

```sql
insert into public.access_grants (email, role, status)
values ('your-google-email@gmail.com', 'owner', 'active')
on conflict (email) do update set role = 'owner', status = 'active';
```

Approve another user with quotas:

```sql
insert into public.access_grants (
  email, role, status, daily_request_limit, monthly_token_limit
)
values ('person@example.com', 'member', 'active', 200, 2000000)
on conflict (email) do update
set status = 'active',
    role = excluded.role,
    daily_request_limit = excluded.daily_request_limit,
    monthly_token_limit = excluded.monthly_token_limit;
```

The grant works whether it is created before or after first login. Revoke access immediately with:

```sql
update public.access_grants set status = 'revoked' where email = 'person@example.com';
```

Use `suspended` for a temporary block and `expires_at` for time-limited access.

## 6. Usage and activity tracking

The migration creates `profiles`, `access_grants`, `usage_events`, and `audit_events`. The browser can
read only its own allowed rows and cannot write trusted grants, usage, or audit data.

Your AI backend must verify the Supabase access token, call `has_active_access()`, enforce quotas,
call the model, and then write usage/audit events with a server-only service-role key. Never put that
key in the browser or desktop app. UI guards are for user experience; the backend and RLS enforce
security.

## 7. Test checklist

1. Start the site with `bun run dev` and open `/login`.
2. Confirm an approved Google account reaches `/account`.
3. Confirm another Google account reaches `/access-denied`.
4. Change the approved account to `revoked`, click **Check access again**, and confirm it is blocked.
5. Confirm `/`, `/features`, `/docs/getting-started`, and `/download` stay public.
6. Confirm the Google secret and Supabase service-role key are absent from source and browser output.
