-- =============================================
-- Profile Tables for Clients and Freelancers
-- =============================================

CREATE TABLE IF NOT EXISTS client_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_image TEXT,
  location VARCHAR(255),
  website VARCHAR(500),
  industry VARCHAR(100),
  company_size VARCHAR(50),
  about_company TEXT,
  project_goals TEXT[],
  project_description TEXT,
  budget_range VARCHAR(20) CHECK (budget_range IN ('small', 'medium', 'large', 'enterprise')),
  timeline VARCHAR(20) CHECK (timeline IN ('urgent', 'short', 'medium', 'long')),
  onboarding_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_client_profiles_user_id ON client_profiles(user_id);
CREATE INDEX idx_client_profiles_industry ON client_profiles(industry);
CREATE INDEX idx_client_profiles_budget ON client_profiles(budget_range);

CREATE TABLE IF NOT EXISTS freelancer_profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  profile_image TEXT,
  title VARCHAR(255),
  location VARCHAR(255),
  bio TEXT,
  experience INT,
  skills TEXT[],
  portfolio_title VARCHAR(255),
  portfolio_description TEXT,
  portfolio_tags TEXT[],
  portfolio_image TEXT,
  portfolio JSONB DEFAULT '[]'::jsonb,
  work_experience JSONB DEFAULT '[]'::jsonb,
  hourly_rate DECIMAL(10, 2),
  onboarding_completed BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_freelancer_profiles_user_id ON freelancer_profiles(user_id);
CREATE INDEX idx_freelancer_profiles_skills ON freelancer_profiles USING GIN(skills);
CREATE INDEX idx_freelancer_profiles_hourly_rate ON freelancer_profiles(hourly_rate);

-- Triggers
CREATE TRIGGER update_client_profiles_updated_at
  BEFORE UPDATE ON client_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_freelancer_profiles_updated_at
  BEFORE UPDATE ON freelancer_profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE client_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE freelancer_profiles DISABLE ROW LEVEL SECURITY;