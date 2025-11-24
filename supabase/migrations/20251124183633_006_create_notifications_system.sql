-- =============================================
-- Notifications System
-- =============================================

-- Enums
CREATE TYPE notification_category AS ENUM (
  'project_opportunity',
  'proposal',
  'contract',
  'payment',
  'message',
  'review',
  'system'
);

CREATE TYPE freelancer_notification_type AS ENUM (
  'project_match_skills',
  'project_invitation',
  'proposal_submitted',
  'proposal_viewed',
  'proposal_message',
  'proposal_accepted',
  'proposal_declined',
  'offer_received',
  'contract_started',
  'client_message',
  'project_requirements_updated',
  'contract_ended',
  'review_received',
  'upfront_payment_secured',
  'final_payment_released',
  'withdrawal_successful'
);

CREATE TYPE client_notification_type AS ENUM (
  'project_posted',
  'new_proposal_received',
  'ai_suggested_freelancers',
  'invited_freelancer_responded',
  'freelancer_message',
  'freelancer_accepted_offer',
  'freelancer_declined_offer',
  'reminder_review_proposals',
  'contract_started',
  'freelancer_message_active',
  'reminder_pay_upfront',
  'reminder_pay_final',
  'contract_ended',
  'reminder_leave_review',
  'upfront_payment_successful',
  'final_payment_successful',
  'invoice_received'
);

-- Notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category notification_category NOT NULL,
  type TEXT NOT NULL,
  title TEXT NOT NULL,
  message TEXT NOT NULL,
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  proposal_id UUID REFERENCES proposals(id) ON DELETE CASCADE,
  conversation_id UUID REFERENCES conversations(id) ON DELETE CASCADE,
  payment_intent_id UUID,
  actor_id UUID REFERENCES users(id) ON DELETE SET NULL,
  actor_name TEXT,
  actor_avatar_url TEXT,
  metadata JSONB DEFAULT '{}',
  action_url TEXT,
  is_read BOOLEAN DEFAULT false,
  is_archived BOOLEAN DEFAULT false,
  read_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notifications_user_id ON notifications(user_id);
CREATE INDEX idx_notifications_user_unread ON notifications(user_id, is_read) WHERE is_read = false;
CREATE INDEX idx_notifications_project_id ON notifications(project_id);
CREATE INDEX idx_notifications_proposal_id ON notifications(proposal_id);
CREATE INDEX idx_notifications_category ON notifications(category);
CREATE INDEX idx_notifications_created_at ON notifications(created_at DESC);
CREATE INDEX idx_notifications_actor_id ON notifications(actor_id);

-- Notification preferences
CREATE TABLE IF NOT EXISTS notification_preferences (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE UNIQUE,
  inapp_project_updates BOOLEAN DEFAULT true,
  inapp_proposal_updates BOOLEAN DEFAULT true,
  inapp_messages BOOLEAN DEFAULT true,
  inapp_payments BOOLEAN DEFAULT true,
  inapp_reviews BOOLEAN DEFAULT true,
  inapp_system BOOLEAN DEFAULT true,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_notification_preferences_user_id ON notification_preferences(user_id);

-- Triggers
CREATE TRIGGER update_notifications_updated_at
  BEFORE UPDATE ON notifications
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_notification_preferences_updated_at
  BEFORE UPDATE ON notification_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE FUNCTION create_default_notification_preferences()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
  INSERT INTO notification_preferences (user_id)
  VALUES (NEW.id);
  RETURN NEW;
END;
$$;

CREATE TRIGGER trigger_create_default_notification_preferences
  AFTER INSERT ON users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_notification_preferences();

-- RLS
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own notifications"
  ON notifications FOR DELETE
  USING (auth.uid() = user_id);

ALTER TABLE notification_preferences ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own preferences"
  ON notification_preferences FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own preferences"
  ON notification_preferences FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own preferences"
  ON notification_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);