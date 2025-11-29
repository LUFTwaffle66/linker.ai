-- Profiles table for Clerk users

CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT,
  full_name TEXT,
  company_name TEXT,
  role TEXT CHECK (role IN ('admin', 'client', 'freelancer')),
  avatar_url TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_profiles_clerk_user_id ON profiles (clerk_user_id);
CREATE INDEX IF NOT EXISTS idx_profiles_role ON profiles (role);

CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY profiles_select_self ON profiles
  FOR SELECT
  USING (
    coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '') = clerk_user_id
  );

CREATE POLICY profiles_insert_self ON profiles
  FOR INSERT
  WITH CHECK (
    coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '') = clerk_user_id
  );

CREATE POLICY profiles_update_self ON profiles
  FOR UPDATE
  USING (
    coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '') = clerk_user_id
  )
  WITH CHECK (
    coalesce((current_setting('request.jwt.claims', true)::jsonb ->> 'sub'), '') = clerk_user_id
  );
