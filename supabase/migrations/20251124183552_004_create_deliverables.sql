-- =============================================
-- Project Deliverables Table
-- =============================================

CREATE TABLE IF NOT EXISTS project_deliverables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  freelancer_id UUID NOT NULL REFERENCES users(id),
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'submitted' CHECK (status IN ('submitted', 'approved', 'revision_requested')),
  submitted_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  reviewed_at TIMESTAMPTZ,
  review_feedback TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX idx_deliverables_project ON project_deliverables(project_id);
CREATE INDEX idx_deliverables_freelancer ON project_deliverables(freelancer_id);
CREATE INDEX idx_deliverables_status ON project_deliverables(status);

-- Trigger
CREATE TRIGGER deliverables_updated_at
  BEFORE UPDATE ON project_deliverables
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

-- RLS
ALTER TABLE project_deliverables ENABLE ROW LEVEL SECURITY;

CREATE POLICY "deliverables_freelancer_select" ON project_deliverables
  FOR SELECT
  TO authenticated
  USING (freelancer_id = auth.uid());

CREATE POLICY "deliverables_freelancer_insert" ON project_deliverables
  FOR INSERT
  TO authenticated
  WITH CHECK (freelancer_id = auth.uid());

CREATE POLICY "deliverables_client_select" ON project_deliverables
  FOR SELECT
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE client_id = auth.uid()
    )
  );

CREATE POLICY "deliverables_client_update" ON project_deliverables
  FOR UPDATE
  TO authenticated
  USING (
    project_id IN (
      SELECT id FROM projects WHERE client_id = auth.uid()
    )
  );