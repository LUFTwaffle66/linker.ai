-- =============================================
-- Projects and Proposals Tables
-- =============================================

CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  title VARCHAR(500) NOT NULL,
  category VARCHAR(100) NOT NULL,
  description TEXT NOT NULL,
  skills TEXT[] NOT NULL,
  fixed_budget DECIMAL(12, 2) NOT NULL CHECK (fixed_budget >= 0),
  timeline VARCHAR(50) NOT NULL,
  attachments JSONB DEFAULT '[]'::jsonb,
  invited_freelancers UUID[],
  status VARCHAR(30) DEFAULT 'open' CHECK (status IN ('draft', 'open', 'in_progress', 'completed', 'cancelled')),
  proposal_count INTEGER DEFAULT 0 CHECK (proposal_count >= 0),
  hired_freelancer_id UUID REFERENCES users(id) ON DELETE SET NULL,
  is_published BOOLEAN DEFAULT TRUE,
  is_featured BOOLEAN DEFAULT FALSE,
  search_vector tsvector,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  published_at TIMESTAMPTZ,
  closed_at TIMESTAMPTZ
);

CREATE INDEX idx_projects_client_id ON projects(client_id);
CREATE INDEX idx_projects_status ON projects(status);
CREATE INDEX idx_projects_is_published ON projects(is_published);
CREATE INDEX idx_projects_created_at ON projects(created_at DESC);
CREATE INDEX idx_projects_category ON projects(category);
CREATE INDEX idx_projects_skills ON projects USING GIN(skills);
CREATE INDEX idx_projects_search_vector ON projects USING GIN(search_vector);

CREATE TABLE IF NOT EXISTS proposals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  cover_letter TEXT NOT NULL,
  total_budget DECIMAL(10, 2) NOT NULL CHECK (total_budget >= 0),
  timeline VARCHAR(100) NOT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'submitted'
    CHECK (status IN ('submitted', 'under_review', 'shortlisted', 'accepted', 'rejected', 'withdrawn')),
  viewed_by_client BOOLEAN NOT NULL DEFAULT FALSE,
  client_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE(project_id, freelancer_id)
);

CREATE INDEX idx_proposals_project_id ON proposals(project_id);
CREATE INDEX idx_proposals_freelancer_id ON proposals(freelancer_id);
CREATE INDEX idx_proposals_status ON proposals(status);
CREATE INDEX idx_proposals_created_at ON proposals(created_at DESC);

-- Functions for search
CREATE OR REPLACE FUNCTION update_project_search_vector()
RETURNS TRIGGER AS $$
BEGIN
  NEW.search_vector :=
    setweight(to_tsvector('english', COALESCE(NEW.title, '')), 'A') ||
    setweight(to_tsvector('english', COALESCE(NEW.description, '')), 'B') ||
    setweight(to_tsvector('english', COALESCE(array_to_string(NEW.skills, ' '), '')), 'C');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Functions for proposal count
CREATE OR REPLACE FUNCTION increment_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET proposal_count = proposal_count + 1
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION decrement_project_proposal_count()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects
  SET proposal_count = GREATEST(0, proposal_count - 1)
  WHERE id = OLD.project_id;
  RETURN OLD;
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE FUNCTION set_project_published_at()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.is_published = TRUE AND (OLD.is_published = FALSE OR OLD.published_at IS NULL) THEN
    NEW.published_at = NOW();
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggers
CREATE TRIGGER projects_updated_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER project_published_at_trigger
  BEFORE UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION set_project_published_at();

CREATE TRIGGER project_search_vector_update
  BEFORE INSERT OR UPDATE ON projects
  FOR EACH ROW
  EXECUTE FUNCTION update_project_search_vector();

CREATE TRIGGER proposals_updated_at_trigger
  BEFORE UPDATE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER proposal_count_increment_trigger
  AFTER INSERT ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION increment_project_proposal_count();

CREATE TRIGGER proposal_count_decrement_trigger
  AFTER DELETE ON proposals
  FOR EACH ROW
  EXECUTE FUNCTION decrement_project_proposal_count();

-- RLS Policies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view published projects"
  ON projects FOR SELECT
  USING (is_published = TRUE);

CREATE POLICY "Clients can view their own projects"
  ON projects FOR SELECT
  USING (client_id = auth.uid());

CREATE POLICY "Clients can create projects"
  ON projects FOR INSERT
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can update their own projects"
  ON projects FOR UPDATE
  USING (client_id = auth.uid())
  WITH CHECK (client_id = auth.uid());

CREATE POLICY "Clients can delete their own projects"
  ON projects FOR DELETE
  USING (client_id = auth.uid());

ALTER TABLE proposals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Freelancers can view their own proposals"
  ON proposals FOR SELECT
  USING (freelancer_id = auth.uid());

CREATE POLICY "Clients can view proposals for their projects"
  ON proposals FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = proposals.project_id
      AND projects.client_id = auth.uid()
    )
  );

CREATE POLICY "Freelancers can create proposals"
  ON proposals FOR INSERT
  WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "Freelancers can update their own proposals"
  ON proposals FOR UPDATE
  USING (freelancer_id = auth.uid() AND status NOT IN ('accepted', 'rejected'))
  WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "Clients can update proposals for their projects"
  ON proposals FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = proposals.project_id
      AND projects.client_id = auth.uid()
    )
  );

CREATE POLICY "Freelancers can delete their own proposals"
  ON proposals FOR DELETE
  USING (freelancer_id = auth.uid() AND status NOT IN ('accepted', 'rejected'));