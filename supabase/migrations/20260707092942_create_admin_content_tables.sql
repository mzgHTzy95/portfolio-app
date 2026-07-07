/*
# Admin content management tables

1. Purpose
   The public portfolio renders projects and blog posts from static MDX files
   via Content Collections (build-time). The admin dashboard lets the owner
   draft and manage content dynamically in Supabase so it can be reviewed before
   being committed to MDX. These tables are the editable source of truth for
   the admin UI; the public site continues to read from compiled MDX.

2. New Tables
   - `admin_projects` — draft/managed project entries mirroring the MDX schema
     (title, description, category, tech_stack, featured, cover_image,
      github_url, live_url, published_at, content body)
   - `admin_posts` — draft/managed blog post entries
     (title, summary, tags, published_at, featured, content body)
   - `admin_settings` — single-row personal info (name, bio, social links)
   - `admin_sessions` — simple session-token table for env-password auth
     (token, expires_at)

3. Security
   - RLS enabled on all tables.
   - admin_projects / admin_posts / admin_settings / admin_sessions are
     admin-only. The frontend anon key must NOT read or write them directly —
     all access goes through the service role in server actions / route
     handlers after the session cookie is validated. Therefore we scope
     policies to `authenticated` AND additionally guard via the session check
     in middleware. For this single-admin app, we allow `authenticated` CRUD
     so a logged-in Supabase user (the owner) can manage everything.
   - Since the app uses a custom env-password login (not Supabase Auth), the
     admin route handlers use the service-role key server-side. RLS still
     protects against anon-key access: anon gets nothing.

4. Notes
   - admin_settings is intentionally single-row (enforced by a unique constraint
     on a fixed key).
   - All timestamps default to now().
*/

CREATE TABLE IF NOT EXISTS admin_projects (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  description text NOT NULL,
  category text NOT NULL DEFAULT 'other',
  tech_stack text[] NOT NULL DEFAULT '{}',
  featured boolean NOT NULL DEFAULT false,
  cover_image text,
  github_url text,
  live_url text,
  published_at text NOT NULL,
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_projects_slug_idx ON admin_projects (slug);

ALTER TABLE admin_projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_crud_admin_projects" ON admin_projects;
CREATE POLICY "auth_crud_admin_projects" ON admin_projects
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS admin_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  slug text NOT NULL,
  summary text NOT NULL,
  tags text[] NOT NULL DEFAULT '{}',
  published_at text NOT NULL,
  featured boolean NOT NULL DEFAULT false,
  body text NOT NULL DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE UNIQUE INDEX IF NOT EXISTS admin_posts_slug_idx ON admin_posts (slug);

ALTER TABLE admin_posts ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_crud_admin_posts" ON admin_posts;
CREATE POLICY "auth_crud_admin_posts" ON admin_posts
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS admin_settings (
  key text PRIMARY KEY DEFAULT 'profile',
  name text NOT NULL DEFAULT '',
  bio text NOT NULL DEFAULT '',
  email text NOT NULL DEFAULT '',
  social_links jsonb NOT NULL DEFAULT '{}'::jsonb,
  updated_at timestamptz DEFAULT now()
);

INSERT INTO admin_settings (key, name, bio, email, social_links)
VALUES ('profile', '', '', '', '{}'::jsonb)
ON CONFLICT (key) DO NOTHING;

ALTER TABLE admin_settings ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_crud_admin_settings" ON admin_settings;
CREATE POLICY "auth_crud_admin_settings" ON admin_settings
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);

CREATE TABLE IF NOT EXISTS admin_sessions (
  token text PRIMARY KEY,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE admin_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "auth_crud_admin_sessions" ON admin_sessions;
CREATE POLICY "auth_crud_admin_sessions" ON admin_sessions
  FOR ALL TO authenticated
  USING (true) WITH CHECK (true);
