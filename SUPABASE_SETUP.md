# CropConnect — Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to https://supabase.com and sign in or create an account.
2. Click "New Project" and fill in:
   - **Name**: CropConnect
   - **Database Password**: (save this securely)
   - **Region**: Choose closest to Bangladesh (e.g., Singapore)
3. Wait for the project to initialize (~2 minutes).

## 2. Configure Environment Variables

Copy `.env.example` to `.env.local`:
```bash
cp .env.example .env.local
```

Fill in from your Supabase project settings (Settings > API):
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
```

> ⚠️ NEVER commit .env.local or expose the SERVICE_ROLE_KEY in frontend code.

## 3. Run Database Migrations

Go to your Supabase project → SQL Editor, and run each migration file in order:

**Step 1**: Copy and paste contents of `supabase/migrations/001_initial_schema.sql` → Run
**Step 2**: Copy and paste contents of `supabase/migrations/002_rls_policies.sql` → Run  
**Step 3**: Copy and paste contents of `supabase/migrations/003_storage_seed.sql` → Run

## 4. Create Admin Account

1. Go to Supabase Auth → Users → Invite user (or use the app to register)
2. Register an account with any email/password on the app
3. In SQL Editor, run:
```sql
SELECT promote_to_admin('your-admin-email@example.com');
```

## 5. Configure Storage

Storage buckets are created by migration 003. Verify they appear in:
Supabase Dashboard → Storage → Buckets:
- `product-images` (public)
- `avatars` (public)
- `verification-docs` (private)

## 6. Enable Email Auth

In Supabase Dashboard → Authentication → Providers:
- Ensure Email is enabled
- Optionally disable email confirmation for development

## 7. Configure Redirect URLs

In Supabase Dashboard → Authentication → URL Configuration:
- Site URL: `http://localhost:3000` (dev) / `https://your-domain.vercel.app` (prod)
- Redirect URLs: Add `http://localhost:3000/**`

## 8. Local Development with Supabase CLI (Optional)

```bash
npm install -g supabase
supabase init
supabase start
```

This runs a local Supabase instance for development.

## Troubleshooting

- **RLS blocking queries**: Make sure user is logged in and policies are enabled
- **Storage upload fails**: Check bucket policies in SQL Editor
- **Auth redirect issues**: Verify Site URL and Redirect URLs in Auth settings
